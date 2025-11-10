import { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import { IJwtpayload } from "../../types/commonType";

const createAppointment = async (req: Request & { user?: IJwtpayload }, res: Response) => {
    try {
        const user = req.user
        const result = await AppointmentService.createAppointment(user as IJwtpayload, req.body)


        res.status(201).json({
            status: true,
            message: "Appointment created successfully",
            data: result
        })

    } catch (err) {
        console.log(err)
    }
}

export const AppointmentController = {
    createAppointment
}