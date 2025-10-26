import { Request, Response } from "express";
import { doctorService } from "./doctor.service";
import pick from "../../utills/pick";
import { doctorFilterableFields, doctorSearchableFields } from "./doctor.constant";

const getDoctroFromDB = async (req: Request, res: Response) => {
    try {
        const filters = pick(req.query, doctorFilterableFields)
        const options = pick(req.query, ['page', 'limit', 'sortBy', 'orderBy'])
        console.log(options, filters)
        const result = await doctorService.getAllFromDB(filters, options)



        res.json({
            status: true,
            message: "Doctor retrived successfully",
            data: result
        })


    } catch (err) {
        console.log(err)
    }
}


// update doctor profile

const updateDcotorProfile = async (req: Request, res: Response) => {
    try {
        const doctorId = req.params.id
        const result = await doctorService.updateDcotorProfile(doctorId, req.body)

        res.json({
            status: true,
            message: "Doctor updated successfully",
            data: result
        })


    } catch (err) {
        console.log(err)
    }
}

const getDoctorSuggestion = async (req: Request, res: Response) => {
    try {
        const result = await doctorService.getAISuggestions(req.body)

        res.json({
            message: "doctor suggesion retrived successfully",
            data: result
        })
    } catch (err) {
        console.log(err)
    }
}


export const doctorControoler = {
    getDoctroFromDB,
    getDoctorSuggestion,
    updateDcotorProfile
}