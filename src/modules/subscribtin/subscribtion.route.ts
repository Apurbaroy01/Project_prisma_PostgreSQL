import { Router } from "express";
import { subscribtionController } from "./subscribtion.controller";
import { auth } from "../../middlewares/auth";
import { ROLE } from "../../../generated/prisma/enums";

const router = Router();

router.post("/checkout", auth(ROLE.USER, ROLE.ADMIN), subscribtionController.createCheckOutSession);

router.post("/webhook", subscribtionController.handleWebhook)

export const subscribtionRoute = router