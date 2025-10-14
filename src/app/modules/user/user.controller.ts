import { Request, Response } from "express";
import { userService } from "./user.service";
import { uploadToCloudinary } from "../../../config/uploadToCloudinary";


const createPatient = async (req: Request, res: Response) => {
    try {
        let data = req.body

       

        if (data.data && typeof data.data === "string") {
            data = JSON.parse(data.data);
        }

         const { name, email, password } = data

        let profilePhoto: string | null = null


        if (req.file) {
            const upload = await uploadToCloudinary(req.file.buffer, 'health_care')
            profilePhoto = upload.secure_url;
        }

        const result = await userService.createPatient({
            name,
            email,
            password,
            profilePhoto
        })

        res.status(201).json({
            status: true,
            message: "User created successfully",
            data: result
        })
    } catch (err) {
        console.log(err)
    }
}


const allUsers = async (req: Request, res: Response) =>{
try{
    const result = await userService.allUsers()

    res.status(201).json({
        status: true,
        message: "User retrieved successfully",
        data: result
    })
}catch(err){
    console.log(err)
}
}

export const userController = {
    createPatient,
    allUsers
}