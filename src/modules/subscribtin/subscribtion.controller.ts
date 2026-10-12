import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { subscribtionServices } from "./subscribtion.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createCheckOutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?.id as string;

    const  result = await subscribtionServices.createCheckOutSession(userid);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Subscription completed successfully",
        data: result
    })
})

export const subscribtionController = {
    createCheckOutSession
}