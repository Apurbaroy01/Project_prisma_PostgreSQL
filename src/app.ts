import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

const app: Application = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors({
    origin: config.app_Url,
    credentials: true
}));

app.post("/api/users/register", async (req: Request, res: Response) => {
    const { name, email, password, profilePhoto } = req.body;

    const isExitUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (isExitUser) {
        throw new Error("User already exist")
    }
    const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_Salt_Rounds))

    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword
        }
    })

    await prisma.profile.create({
        data: {
            userId: createUser.id,
            profilePhoto
        }
    })

    const user = await prisma.user.findUnique({
        where: {
            id: createUser.id,
            email: createUser.email
        },
        omit:{
            password: true
        },
        include: {
            profile: true
        }
    })


    res.status(201).json({
        success: true,
        message: "user success register",
        data: user
    })
})

export default app