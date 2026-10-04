import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { postService } from "./post.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

// create post
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

// get all posts
const getPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPosts();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Posts fetched successfully",
        data: result
    })

});

// get post by id and views update
const getMyPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    if (!postId) {
        throw new Error("Post id is required");
    }

    const result = await postService.getMyPostById(postId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post fetched successfully",
        data: result
    })
});

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    if (!authorId) {
        throw new Error("Author id is required");
    }
    const result = await postService.getMyPosts(authorId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Posts fetched successfully",
        data: result
    })

});

const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});

const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;
    const payload = req.body;

    if (!authorId) {
        throw new Error("Author id is required");
    }

    const result = await postService.updatePost(postId as string, payload, authorId as string, isAdmin);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post updated successfully",
        data: result
    })
});


const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId;

    if (!authorId) {
        throw new Error("Author id is required");
    }

    const result = await postService.deletePost(postId as string, authorId as string, isAdmin);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post deleted successfully",
        data: result
    })

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
