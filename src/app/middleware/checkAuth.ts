import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utills/jwt";
import { prisma } from "../../config/db";
import { JwtPayload } from "jsonwebtoken";

const checkAuth = (...authRoles: string[]) => async (req: Request & {user?:any}, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization || req.cookies.accessToken

        if (!token) {
            throw new Error("Token is not found")
        }

        const verifiedToken = verifyToken(token, "secret") as JwtPayload

        

        const isUserExist = await prisma.user.findUnique({ where: { email: verifiedToken.userEmail } })

        if (!isUserExist) {
            throw new Error("User not found")
        }

        if (!authRoles.includes(verifiedToken.userRole)){
            throw new Error("You are not authorize to view this")
        }

      

      req.user = verifiedToken
      next()

    } catch (err) {
        console.log(err)
        next(err)
    }
}

export default checkAuth