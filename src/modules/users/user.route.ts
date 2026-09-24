import { Router } from "express";
import { userController } from "./user.controller";
import { ROLE } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router();


router.post("/register", userController.registerUser);

router.get("/me", auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR), userController.getmyprofile)

router.put("/my-profile", auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR), userController.upadteMyProfile)


export const userRoute = router;