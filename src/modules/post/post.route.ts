import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { ROLE } from "../../../generated/prisma/client";
import { postController } from "./post.controller";

const router = Router();

router.post("/", auth(ROLE.USER, ROLE.ADMIN), postController.createPost)
router.get("/", auth(ROLE.USER, ROLE.ADMIN), postController.getPosts)
router.get("/my-posts", auth(ROLE.USER, ROLE.ADMIN), postController.getMyPosts)
router.get("/:postId", auth(ROLE.USER, ROLE.ADMIN), postController.getMyPostById)


router.get("/stats", auth(ROLE.USER, ROLE.ADMIN), postController.getPostStats)

router.patch("/:postId", auth(ROLE.USER, ROLE.ADMIN), postController.updatePost)
router.delete("/:postId", auth(ROLE.USER, ROLE.ADMIN), postController.deletePost)




export const postRoute = router;