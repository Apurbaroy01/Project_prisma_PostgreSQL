import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { ROLE } from "../../../generated/prisma/enums";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";

const router = Router();

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                email: string,
                name: string,
                role: ROLE
            }
        }
    }
}

router.post("/register", userController.registerUser);


const auth = (...requrdRoles: ROLE[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const Token = req.cookies.accessToken || req.headers.authorization?.split("Bearer ")[1];
        if (!Token) {
            throw new Error("You are not logged in")
        }

        const verifideToken = jwtUtils.verifyToken(Token, config.jwt_access_Secret!)
        if (!verifideToken.success) {
            throw new Error(verifideToken.error)
        }

        const { id, email, name, role } = verifideToken.data as JwtPayload;

        if (requrdRoles.length && !requrdRoles.includes(role)) {
            throw new Error("You don't have permission to access this route")
        }
        const user = await prisma.user.findUnique({ where: { id, email, name, role } })
        if (!user) {
            throw new Error("User not found")
        }
        if (user.activeStatus === "BLOCKED") {
            throw new Error("User is blocked")
        }

        req.user = { id, email, name, role }
        next();
    })
}

router.get("/me", auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR), userController.getmyprofile)

export const userRoute = router;