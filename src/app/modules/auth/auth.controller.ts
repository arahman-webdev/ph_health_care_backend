import { Request, Response } from "express";
import { authService } from "./auth.service";

const userLogin = async (req: Request, res: Response) => {
    try {
        const result = await authService.userLogin(req.body)


        const {accessToken, refreshToken} = result

        res.cookie("accessToken", accessToken,{
            secure: true,
            httpOnly: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60
        })

        res.cookie("refreshToken", refreshToken,{
            secure: true,
            httpOnly: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 90
        })

        res.status(201).json({
            status: true,
            message: "User logged in successfully",
            data: {}
        })
    } catch (err) {
        console.log(err)
    }
}





export const authController = {
    userLogin
}