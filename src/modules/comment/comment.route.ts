import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { ROLE } from "../../../generated/prisma/enums";
import { commentController } from "./comment.controller";

const router = Router();

router.post("/", auth(ROLE.USER, ROLE.ADMIN), commentController.createComment)
router.get("/author/:authorId", auth(ROLE.USER, ROLE.ADMIN), commentController.getCommentByAuthorId)
router.get("/:commentId", auth(ROLE.USER, ROLE.ADMIN), commentController.getCommentById)
router.patch("/:commentId", auth(ROLE.USER, ROLE.ADMIN), commentController.updateComment)
router.delete("/:commentId", auth(ROLE.USER, ROLE.ADMIN), commentController.deleteComment)
router.put("/:commentId/:moderate", auth(ROLE.USER, ROLE.ADMIN), commentController.moderateComment)


export const commentRoute = router;