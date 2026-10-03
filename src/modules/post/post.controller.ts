import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { postService } from "./post.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    if (!id) {
        return next(new Error("User not authenticated"));
    }
    const payload = req.body;

    const result = await postService.createPost(payload, id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Post created successfully",
        data: result
    })
});

const getPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});

const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});
const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});
const getMyPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});
const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});
const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});

export const postController = {
    createPost,
    getPosts,
    getPostStats,
    getMyPosts,
    getMyPostById,
    updatePost,
    deletePost
}
