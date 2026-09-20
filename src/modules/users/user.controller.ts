import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status"


const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userService.registeruserIntoDB(payload)

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "user success register",
        data: user
    })
})

export const userController = {
    registerUser
}