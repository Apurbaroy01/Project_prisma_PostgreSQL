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
    const { accessToken } = req.cookies;

    const verifideToken = jwtUtils.verifyToken(accessToken, config.jwt_access_Secret!)

    if (typeof verifideToken === "string") {
        throw new Error(verifideToken)
    }
    
    const profile = await userService.getmyprofile(verifideToken.id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User fetched successfully",
        data: { profile }
    })

})

export const userController = {
    registerUser,
    getmyprofile
} 