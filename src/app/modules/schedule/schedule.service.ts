import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../../config/db";
import { schedulePagination, TOptions } from "../../utills/parcticePaginationHelper";
import { Prisma } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
// import { prisma } from "../../../../config/db"; // Commented out for debugging

const createSchedule = async (payload: any) => {
  const { startTime, endTime, startDate, endDate } = payload;

  // console.log("Start Date:", startDate, "Start Time:", startTime);

  const intervalMinutes = 30; // Length of each slot in minutes
  const allSlots: { start: Date; end: Date }[] = []; // Store generated slots for debugging

  let currentDay = new Date(startDate); // Start date
  const finalDay = new Date(endDate); // End date

  while (currentDay <= finalDay) {
    // -------------------------------
    // 1️⃣ Create the start and end time for the current day
    // -------------------------------
    let dayStartTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDay, "yyyy-MM-dd")}`, // "2025-10-18"
          Number(startTime.split(":")[0]) // Hours part, e.g., 10
        ),
        Number(startTime.split(":")[1]) // Minutes part, e.g., 00
      )
    );

    const dayEndTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDay, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    // console.log("\n📅 Current Day:", format(currentDay, "yyyy-MM-dd"));
    // console.log("  Day Start:", dayStartTime.toLocaleTimeString());
    // console.log("  Day End:", dayEndTime.toLocaleTimeString());

    // -------------------------------
    // 2️⃣ Generate all slots for the current day
    // -------------------------------
    while (dayStartTime < dayEndTime) {
      const slotStart = new Date(dayStartTime); // Clone current start
      const slotEnd = addMinutes(slotStart, intervalMinutes); // Slot end = start + interval

      console.log(
        `   ➤ Slot: ${slotStart.toLocaleTimeString()} - ${slotEnd.toLocaleTimeString()}`
      );


      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: slotStart,
          endDateTime: slotEnd,
        },
      });

      if (!existingSchedule) {
        await prisma.schedule.create({
          data: {
            startDateTime: slotStart,
            endDateTime: slotEnd,
          },
        });
      }

      // Store slot in array for debugging
      allSlots.push({ start: slotStart, end: slotEnd });

      // -------------------------------
      // 4️⃣ Move start time forward by interval
      // -------------------------------
      dayStartTime = addMinutes(dayStartTime, intervalMinutes);
    }

    // -------------------------------
    // 5️⃣ Move to the next day
    // -------------------------------
    currentDay.setDate(currentDay.getDate() + 1);
  }



  return allSlots;
};


const getSchedule = async (options: TOptions, filters: any, user: JwtPayload) => {
  const { page, limit, skip, sortBy, orderBy } = schedulePagination(options)

  const { startDateTime, endDateTime } = filters

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDateTime
          }
        },
        {
          endDateTime: {
            lte: endDateTime
          }
        }

      ]
    })
  }


  const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? {
    AND: andConditions
  } : {}



  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: user.userEmail
      }
    },
    select: {
      scheduleId: true
    }
  })

  console.log("from schedule services", doctorSchedules)

  const doctorScheduleIds = doctorSchedules.map(doctorScheduleId => doctorScheduleId.scheduleId)


  const allSchedules = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds
      }
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: orderBy
    }
  })

  const totlaSchedules = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds
      }
    },
  })

  return {
    meta: {
      page,
      limit,
      totlaSchedules
    },
    data: allSchedules
  }
}



const deleteScheduleService = async (id: string) => {
  const deleteSchedule = await prisma.schedule.delete({
    where: { id }
  })

  return deleteSchedule
}


export const ScheduleService = {
  createSchedule,
  getSchedule,
  deleteScheduleService
};
