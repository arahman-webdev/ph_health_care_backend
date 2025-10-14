
import bcryptjs from "bcryptjs"
import { prisma } from "../../../config/db";

import { PatientCreateInput } from "./user.interface";


const createPatient = async (payload: PatientCreateInput) => {

    const hashPassword = await bcryptjs.hash(payload.password, Number(process.env.BCRYPT_SALT_ROUNDS))

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: hashPassword
            }
        });

        return await tnx.patient.create({
            data: {
                name: payload.name,
                email: payload.email,
                profilePhoto: payload.profilePhoto
            }
        })
    })



    return result
}



const allUsers = async()=>{
    const users = await prisma.user.findMany()
    return users
}

export const userService = {
    createPatient,
    allUsers
}