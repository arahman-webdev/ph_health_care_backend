import { Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../utills/paginationHelpers";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../../config/db";
import { openai } from "../../../config/router.openai";
import { IDoctorUpdateInput } from "./doctor.interface";

const getAllFromDB = async (filters: any, options: IOptions) => {
    const { page, limit, skip, sortBy, orderBy } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;


    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    // "", "medicine"
    if (specialties && specialties.length > 0) {
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialties,
                            mode: "insensitive"
                        }
                    }
                }
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: orderBy
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    const total = await prisma.doctor.count({
        where: whereConditions
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}

const updateDcotorProfile = async (id: string, payload: Partial<IDoctorUpdateInput>) => {
  const { specialties, ...doctorData } = payload;

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Handle specialties (if provided)
    if (specialties?.length) {
      // Remove deleted specialties
      const deleteIds = specialties
        .filter((s) => s.isDeleted)
        .map((s) => s.specialtyId);

      if (deleteIds.length) {
        await tx.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialitiesId: { in: deleteIds },
          },
        });
      }

      // Add new specialties
      const addIds = specialties
        .filter((s) => !s.isDeleted)
        .map((s) => s.specialtyId);

      if (addIds.length) {
        const data = addIds.map((specialtyId) => ({
          doctorId: id,
          specialitiesId: specialtyId,
        }));
        await tx.doctorSpecialties.createMany({ data });
      }
    }

    // 2️⃣ Update doctor basic info
    const updatedDoctor = await tx.doctor.update({
      where: { id },
      data: doctorData,
      include: {
        doctorSpecialties: {
          include: {
            specialities: true,
          },
        },
      },
    });

    return updatedDoctor;
  });
};



const getAISuggestions = async (payload: { symptoms: string }) => {
    if (!(payload && payload.symptoms)) {
        throw new Error("symptoms is required!")
    };

    const doctors = await prisma.doctor.findMany({
        where: { isDeleted: false },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    console.log("doctors data loaded.......\n");
    const prompt = `
You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
Each doctor has specialties and years of experience.
Only suggest doctors who are relevant to the given symptoms.

Symptoms: ${payload.symptoms}

Here is the doctor list (in JSON):
${JSON.stringify(doctors, null, 2)}

Return your response in JSON format with full individual doctor data. 
`;

    console.log("analyzing......\n")
    const completion = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content:
                    "You are a helpful AI medical assistant that provides doctor suggestions.",
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    
  

    const aiContent = completion.choices[0].message?.content || "";

  // 🧠 Extract the JSON part safely (between ```json ... ``` or raw JSON)
  const match = aiContent.match(/```json([\s\S]*?)```/);
  const jsonString = match ? match[1].trim() : aiContent.trim();

  let suggestions;
  try {
    suggestions = JSON.parse(jsonString);
  } catch (err) {
    console.error("❌ Failed to parse AI JSON output:", err);
    console.log("Raw content:", aiContent);
    throw new Error("AI response was not valid JSON.");
  }

  console.log("✅ AI Suggested Doctors:\n", suggestions);
  return suggestions;
}


export const doctorService = {
    getAllFromDB,
    getAISuggestions,
    updateDcotorProfile
}