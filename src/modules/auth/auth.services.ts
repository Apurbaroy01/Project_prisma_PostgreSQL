import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface"
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email
        }
    })

    if (user.activeStatus === "BLOCKED") {
        throw new Error("User is blocked")
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
        throw new Error("Invalid password")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    // const accessToken = jwt.sign({ jwtPayload }, config.jwt_access_Secret!,
    //     {
    //         expiresIn: config.jwt_access_expires_in
    //     } as SignOptions
    // )

    // access Token
    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_Secret!, config.jwt_access_expires_in as SignOptions)

    // refresh Token
    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_Secret!, config.jwt_refresh_expires_in as SignOptions)

    return {
        accessToken,
        refreshToken
    }

}

export const authService = {
    loginUser
}