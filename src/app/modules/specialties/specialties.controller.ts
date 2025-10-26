import { NextFunction, Request, Response } from "express"
import { SpecialtiesService } from "./specialties.service"
import { uploadToCloudinary } from "../../../config/uploadToCloudinary"


const createSpecialtyController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let data = req.body


        if (data.data && typeof data.data === "string") {
            data = JSON.parse(data.data)
        }

        const { title } = data

        let icon: string | null = null


        if (req.file) {
            const uploadIcon = await uploadToCloudinary(req.file.buffer, "health_care")
            icon = uploadIcon.secure_url;
        }

        const result = await SpecialtiesService.createSpecialtyService({

            title,
            icon
        })

        res.status(201).json({
            status: true,
            message: "Specialty created successfully",
            data: result
        })


    } catch (err) {
        console.log(err)
    }
}


const getAllFromDB = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await SpecialtiesService.getAllFromDB()

        res.status(201).json({
            status: true,
            message: "Specialty got successfully",
            data: result
        })
    } catch (err) {
        console.log(err)
    }
}

const deleteFromDB = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await SpecialtiesService.deleteFromDB(req.params.id)

        res.status(201).json({
            status: true,
            message: "Specialty deleted successfully",
            data: result
        })

    } catch (err) {
        console.log(err)
    }
}


export const specialtiesController = {
    createSpecialtyController,
    getAllFromDB,
    deleteFromDB
}