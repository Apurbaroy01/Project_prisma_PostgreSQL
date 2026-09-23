import { Router } from "express";
import { userController } from "./user.controller";


const router = Router();

router.post("/register", userController.registerUser)
router.get("/me", userController.getmyprofile)

export const userRoute = router;