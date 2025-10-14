import { UserStatus } from "@prisma/client"
import { prisma } from "../../../config/db"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { generateToken } from "../../utills/jwt"


const userLogin = async(payload:{email:string, password:string})=>{

    const user = await prisma.user.findFirstOrThrow({
        where:{
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })


    const isCorrecctedPassword = await bcryptjs.compare(payload.password, user.password)

    if(!isCorrecctedPassword){
        throw new Error("Your password is not correct")
    }

    

    const userToken = generateToken({email: user.email, role:user.role}, "secret", "1h")

    const refreshToken = generateToken({email: user.email, role:user.role}, "secret", "1h")

    return {
        accessToken: userToken,
        refreshToken
    }
}

export const authService = {
    userLogin
}