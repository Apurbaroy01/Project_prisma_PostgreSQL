import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status"
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";


// register user
const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registeruserIntoDB(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created successfully",
        data: { user }
    })
})

// get my profile
const getmyprofile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const profile = await userService.getmyprofile(req.user?.id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User fetched successfully",
        data: { profile }
    })

})

const upadteMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const updatedprofile = await userService.upadteMyProfile(req.user?.id as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User updated successfully",
        data: { updatedprofile }
    })

})

export const userController = {
    registerUser,
    getmyprofile,
    upadteMyProfile
} 