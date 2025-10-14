import { UploadApiResponse } from "cloudinary"
import { cloudinaryUpload } from "./cloudinary.config"

export const uploadToCloudinary = (my_image: Buffer, folder:"health_care"):Promise<UploadApiResponse> =>{
    return new Promise((resolve, reject)=>{
        const stream = cloudinaryUpload.uploader.upload_stream(
            {
                folder,
                resource_type:"image"
            },
            (err, result)=>{
                if(err || !result) reject(err)
                    else resolve(result)
            }
        )

        stream.end(my_image)
    })
}