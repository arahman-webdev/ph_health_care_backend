import { Request, Response } from "express";
import { userService } from "./user.service";
import { uploadToCloudinary } from "../../../config/uploadToCloudinary";
import pick from "../../utills/pick";


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


// const allUserss = async (req: Request, res: Response) =>{
// try{
    
//     const page = Number(req.query.page) || 1
//     const limit = Number(req.query.limit) || 4
//     const searchTerm = (req.query.searchTerm as string) || ""
//     const sortBy = (req.query.sortBy as string)
//     const orderBy = (req.query.orderBy as string)
//     const role = req.query.role
//     const status = req.query.status

    
   
//     const result = await userService.allUsers({page, limit,searchTerm,sortBy, orderBy, role, status})

//     res.status(201).json({
//         status: true,
//         message: "User retrieved successfully",
//         data: result
//     })
// }catch(err){
//     console.log(err)
// }
// }


const allUsers = async (req: Request, res: Response) =>{
try{
    
    const filters = pick(req.query, ["status", "role", "email", "searchTerm"] )
    const options = pick(req.query, ["page", "limit","sortBy","orderBy"])
   
    const result = await userService.allUsers(filters, options)

    res.status(201).json({
        status: true,
        message: "User retrieved successfully",
        data: result.data,
        meta: result.meta

        
            
        
    })
}catch(err){
    console.log(err)
}
}

export const userController = {
    createPatient,
    allUsers
}