import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { userRoute } from "./modules/users/user.route";
import { authRoute } from "./modules/auth/auth.route";


const app: Application = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors({
    origin: config.app_Url,
    credentials: true
}));

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)


export default app