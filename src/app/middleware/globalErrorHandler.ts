import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode: number = err.statusCode || 500;
    let success: boolean = false;
    let message: string = err.message || "Internal Server Error";
    let error = err

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            message = `${err.meta?.target} already exists.`,
                error = err.meta?.target,
                statusCode = httpStatus.BAD_REQUEST
        }
        if (err.code === "P1000") {
            message = "Authentication failed against database server",
                error = err.meta,
                statusCode = httpStatus.BAD_GATEWAY
        }
        if (err.code === "P2003") {
            message = "Foreign key constraint failed",
                error = err.meta,
                statusCode = httpStatus.BAD_REQUEST
        }
    }

    else if (err instanceof Prisma.PrismaClientValidationError) {
        message = "Validation Error",
            error = err.message,
            statusCode = httpStatus.BAD_REQUEST
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        message = "Unknown Prisma error occured!",
            error = err.message,
            statusCode = httpStatus.BAD_REQUEST
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        message = "Prisma client failed to initialize!",
            error = err.message,
            statusCode = httpStatus.BAD_REQUEST
    }


    res.status(statusCode).json({
        success,
        message,
        error
    })
}

export default globalErrorHandler;