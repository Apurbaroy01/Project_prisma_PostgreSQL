import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { userRoute } from "./modules/users/user.route";


const app: Application = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors({
    origin: config.app_Url,
    credentials: true
}));

app.use("/api/users", userRoute)


export default app