import { NextFunction, Request, Response } from "express"
import { DoctorScheduleService } from "./doctorSchedule.service"
import { IJwtpayload } from "../../types/commonType"

const createSchedule = async (req: Request & { user?: IJwtpayload }, res: Response, next: NextFunction) => {
    try {

        const user = req.user

        const doctorSchedule = DoctorScheduleService.doctorBookedSchedule(user as IJwtpayload, req.body)

        res.json({
            status: true,
            message: "Dr schedule created successfully",
            data: doctorSchedule
        })
    } catch (err) {
        console.log(err)
    }
}


const getDoctorBookedSchedule = async (req: Request, res: Response, next: NextFunction) => {


    const result = await DoctorScheduleService.getDoctorBookedSchedule()

    res.json({
        status: true,
        message: "Dr retrived successfully",
        data: result
    })

}


export const DoctorScheduleController = {
    createSchedule,
    getDoctorBookedSchedule
}