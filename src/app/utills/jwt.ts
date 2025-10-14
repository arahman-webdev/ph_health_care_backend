import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

export const generateToken = (payload:object, secret:string, expiresIn:string) =>{
    
    const accessToken = jwt.sign(payload, secret, {
        algorithm:"HS256",
        expiresIn
    } as SignOptions)

    return accessToken
}