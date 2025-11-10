import { NextFunction, Request, Response } from "express";

const notFound = async(req:Request, res:Response, next:NextFunction)=>{
    res.status(404).json({
        success: false,
        message: "Route not found",
        error:{
            path: req.originalUrl,
            message: "Your requested route is not found"
        }
    })
}

export default notFound;