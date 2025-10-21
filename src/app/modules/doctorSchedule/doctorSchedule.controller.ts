import { NextFunction, Request, Response } from "express"
import { DoctorScheduleService } from "./doctorSchedule.service"

const createSchedule = async(req:Request & {user?:any}, res:Response, next:NextFunction) =>{
    try{
       
        const user = req.user
        const doctorSchedule = DoctorScheduleService.createSchedule(user, req.body)

        console.log("from controller",doctorSchedule)

        res.json({
            status: true,
            message: "Dr schedule created successfully",
            data: doctorSchedule
        })
    }catch(err){
        console.log(err)
    }
}



export const DoctorScheduleController = {
    createSchedule,
}