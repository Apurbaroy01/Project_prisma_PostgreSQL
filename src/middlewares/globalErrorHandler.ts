import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { Prisma } from "../../generated/prisma/client"


export const globalErrorHandler = ((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)

    let statusCode: number | undefined
    let errorMessage = err.message || "Something went wrong"
    let errorName = err.name || "Internal Server Error"

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST
        errorMessage = "Validation Error"
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpStatus.BAD_REQUEST
            errorMessage = "Duplicate key error"
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST
            errorMessage = "Foreign key constraint error"
        }else if (err.code === "P2025") {
            statusCode = httpStatus.BAD_REQUEST
            errorMessage = "Record not found"
        }
    }else if (err instanceof Prisma.PrismaClientInitializationError) {
        if(err.errorCode === "P1000"){
            statusCode = httpStatus.UNAUTHORIZED
            errorMessage = "Authorization Error, please your credentials are incorrect"
        }else if(err.errorCode === "P1001"){
            statusCode = httpStatus.BAD_REQUEST
            errorMessage = "Cannot reach database server"
        }
    }else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
        errorMessage = "Unknown request error"
    }

    res.status(statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        name: errorName,
        message: errorMessage,
        error: err.stack
    })
})