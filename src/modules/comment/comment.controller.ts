import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentServices } from "./comment.services";
import { sendResponse } from "../../utils/sendResponse";

const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const result = await commentServices.createComment(authorId, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Comment created successfully",
        data: result
    })
});

const getCommentByAuthorId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const result = await commentServices.getCommentByAuthorId(authorId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comments fetched successfully",
        data: result
    })
});

const getCommentByCommentId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const result = await commentServices.getCommentByCommentId(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment fetched successfully",
        data: result
    })
});

const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const authorId = req.user?.id as string;
    const IsAdmin = req.user?.role === "admin" as string;

    const result = await commentServices.updateComment(id, req.body, authorId, IsAdmin);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment updated successfully",
        data: result
    })
});

const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const authorId = req.user?.id as string;
    const IsAdmin = req.user?.role === "admin" as string;

    const result = await commentServices.deleteComment(id, authorId, IsAdmin);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment deleted successfully",
        data: result
    })

});

const moderateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const authorId = req.user?.id as string;
    const IsAdmin = req.user?.role === "admin" as string;

    const result = await commentServices.moderateComment(id, authorId, req.body, IsAdmin);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comment moderated successfully",
        data: result
    })

});

export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}