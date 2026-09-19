import { Request, Response } from "express";
import { userService } from "./user.services";


const registerUser = async (req: Request, res: Response) => {
    try {
        const payload = req.body;

        const user = await userService.registeruserIntoDB(payload)

        res.status(201).json({
            success: true,
            message: "user success register",
            data: user
        })
    } catch (error: any) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const userController = {
    registerUser
}