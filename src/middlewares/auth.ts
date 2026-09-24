import { NextFunction, Request, Response } from "express";
import { ROLE } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: ROLE;
            }
        }
    }
}

export const auth = (...requrdRoles: ROLE[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const Token = req.cookies.accessToken ? req.cookies.accessToken
            :
            req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization;
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