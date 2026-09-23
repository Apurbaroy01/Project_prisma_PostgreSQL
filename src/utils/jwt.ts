import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {
    const token = jwt.sign(payload, secret, { expiresIn } as SignOptions)
    return token

}

const verifyToken = (token: string, secret: string) => {
    try {
        const verifyedToken = jwt.verify(token, secret);
        return verifyedToken;
    } catch (error: any) {
        console.log("token verified failed", error)
        throw new Error(error.message)
    }
}

export const jwtUtils = {
    createToken,
    verifyToken
}