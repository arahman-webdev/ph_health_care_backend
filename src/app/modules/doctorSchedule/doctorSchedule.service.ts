import { prisma } from "../../../config/db";

const createSchedule = async (user: any, payload: any) => {


  console.log({user, payload})

  //    const doctorScheduleData = payload.scheduleIds.map((scheduleId)=>({
  //     doctorId: scheduleId
  //    }))

  // const doctorSchedule = prisma.doctorSchedule.createMany({
  //   data: payload.scheduleId
  // })

  return {user, payload}
};



export const DoctorScheduleService = {
  createSchedule,
};
