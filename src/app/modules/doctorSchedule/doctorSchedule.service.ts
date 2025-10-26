import { prisma } from "../../../config/db"
import { IJwtpayload } from "../../types/commonType"


const doctorBookedSchedule = async (user: IJwtpayload, payload: { scheduleId: string[] }) => {

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: { email: user.userEmail }
    })

    const doctorScheduleData = payload.scheduleId.map((scheduleId) => ({
        doctorId: doctorData.id,
        scheduleId
    }))

   

  const result = await prisma.doctorSchedule.createMany({
        data: doctorScheduleData
    });

    return result

}


const getDoctorBookedSchedule = async()=>{
    const result = await prisma.doctorSchedule.findMany()
    
    return result
}

export const DoctorScheduleService = {
    doctorBookedSchedule,
    getDoctorBookedSchedule
}
