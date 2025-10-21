import { NextFunction, Request, Response } from "express";
import { ScheduleService } from "./schedule.service";
import prPick from "../../utills/practicePick";

const createSchedule = async(req:Request, res:Response, next:NextFunction) =>{
    try{
        const result = await ScheduleService.createSchedule(req.body)

        console.log(result)

        res.json({
            data: result
        })
    }catch(err){
        console.log(err)
    }
}
const getSchedule = async(req:Request, res:Response, next:NextFunction) =>{
    try{

        const options = prPick(req.query, ["page", "limit", "sortBy", "orderBy"])
        
        const filter = prPick(req.query, ["startDateTime", "endDateTime"])
     
    
        const result = await ScheduleService.getSchedule(options, filter)

     

        res.json({
            data: result
        })
    }catch(err){
        console.log(err)
    }
}


const deleteSchedule = async(req:Request, res:Response, next:NextFunction) =>{
    try{
        const scheduleId = req.params.id
        const result = await ScheduleService.deleteScheduleService(scheduleId)

        res.status(201).json({
            status: true,
            message: "Schedule deleted successfully",
            data: result
        })
    }catch(err){
        console.log(err)
        next(err)
    }
}



export const scheduleController = {
    createSchedule,
    getSchedule,
    deleteSchedule
}