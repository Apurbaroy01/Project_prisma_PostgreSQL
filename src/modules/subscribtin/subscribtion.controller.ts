import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"

const createCheckOutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

export const subscribtionController = {
    createCheckOutSession
}