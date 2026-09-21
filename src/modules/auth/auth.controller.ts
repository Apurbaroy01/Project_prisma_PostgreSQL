import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const loginResponse = await authService.loginUser(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: loginResponse
    })

})

export const authController = {
    loginUser
}