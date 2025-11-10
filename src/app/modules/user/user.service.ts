
import bcryptjs from "bcryptjs"
import { prisma } from "../../../config/db";

import { AdminCreateInput, DoctorCreateInput, UserCreateInput } from "./user.interface";
import { IOptions, paginationHelper } from "../../utills/paginationHelpers";
import { Doctor, Prisma, UserRole, UserStatus } from "@prisma/client";
import { IJwtpayload } from "../../types/commonType";


const createPatient = async (payload: UserCreateInput) => {

    const hashPassword = await bcryptjs.hash(payload.password, Number(process.env.BCRYPT_SALT_ROUNDS))

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword
            }
        });

        return await tnx.patient.create({
            data: {
                name: payload.name,
                email: payload.email,
                profilePhoto: payload.profilePhoto
            }
        })
    })


    return result
}


// Create admin 


const createAdmin = async (payload: AdminCreateInput) => {
    const hashPassword = await bcryptjs.hash(payload.password, Number(process.env.BCRYPT_SALT_ROUNDS))

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword,
                role: payload.role || UserRole.ADMIN
            }
        });

        return await tnx.admin.create({
            data: {
                name: payload.name,
                email: payload.email,
                profilePhoto: payload.profilePhoto,
                contactNumber: payload.contactNumber,

            }
        })



    })

    return result


}
const createDoctor = async (payload: DoctorCreateInput) => {
    const hashPassword = await bcryptjs.hash(payload.password, Number(process.env.BCRYPT_SALT_ROUNDS))


    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword,
                role: payload.role
            }
        });

        return await tnx.doctor.create({
            data: {
                name: payload.name,
                email: payload.email,
                profilePhoto: payload.profilePhoto,
                contactNumber: payload.contactNumber,
                address: payload.address,
                registrationNumber: payload.registrationNumber,
                gender: payload.gender,
                appointmentFee: payload.appointmentFee,
                qualification: payload.qualification,
                currentWorkingPlace: payload.currentWorkingPlace,
                designation: payload.designation,

            }
        })
    })

    return result
}



const allUserss = async ({ page, limit, searchTerm, orderBy, sortBy, role, status }: { page: number, limit: number, searchTerm?: string, orderBy: string, sortBy: string, role: any, status: any }) => {

    const skip = (page - 1) * limit

    const users = await prisma.user.findMany({
        skip,
        take: limit,
        where: {
            email: {
                contains: searchTerm,
                mode: "insensitive"
            },
            role: role,
            status: status

        },
        orderBy: sortBy && orderBy ? {
            [sortBy]: orderBy
        } : {
            createdAt: "asc"
        }
    })
    return users
}


const allUsers = async (params: any, options: IOptions) => {

    const { page, limit, skip, sortBy, orderBy } = paginationHelper.calculatePagination(options)

   

    const { searchTerm, ...filterData } = params;

    console.log(searchTerm, filterData)

    const andConditions: Prisma.UserWhereInput[] = [];


    console.log(andConditions)

    if (searchTerm) {
        andConditions.push({
            OR: ["email"].map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}



    const users = await prisma.user.findMany({
        skip,
        take: limit,
        where: {
            AND: whereConditions
        },
        orderBy: {
            [sortBy]: orderBy
        }
    });


    const totalUsers = await prisma.user.count({
        where: whereConditions
    })
    return {
        meta: {
            page,
            limit,
            totalUsers
        },
        data: users
    }
}

const getMyProfile = async (user: IJwtpayload) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.userEmail,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true
        }
    })

    let profileData;

    if (userInfo.role === UserRole.PATIENT) {
        profileData = await prisma.patient.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileData = await prisma.doctor.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileData = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }

    return {
        ...userInfo,
        ...profileData
    };

};


export const userService = {
    createPatient,
    allUsers,
    createAdmin,
    createDoctor,
    getMyProfile
}