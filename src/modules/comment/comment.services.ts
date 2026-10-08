import { prisma } from "../../lib/prisma";
import { IcreateCommentpayload, IModerateCommentpayload, IupdateCommentpayload } from "./comment.interface";

const createComment = async (authorId: string, payload: IcreateCommentpayload) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    });
    const comment = await prisma.comment.create({
        data: {
            ...payload,
            authorId
        }
    });

    return comment;
};

const getCommentByAuthorId = async (authorId: string) => {
    const comments = await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true
                }
            }
        }
    })

    return comments;
};

const getCommentByCommentId = async (commentId: string) => {
    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true,
                }
            }
        }
    });

    return comment;
};

const updateComment = async (commentId: string, payload: IupdateCommentpayload, authorId: string, IsAdmin: boolean) => {
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        }
    });

    if (!IsAdmin && comment.authorId !== authorId) {
        throw new Error("You are not authorized to update this comment");
    };

    const updatedComment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: payload
    });

    return updatedComment
}

const deleteComment = async (commentId: string, authorId: string, IsAdmin: boolean) => {
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        }
    });

    if (!IsAdmin && comment.authorId !== authorId) {
        throw new Error("You are not authorized to delete this comment");
    }

    const deletedComment = await prisma.comment.delete({
        where: {
            id: commentId
        }
    });

    return deletedComment;
};

const moderateComment = async (commentId: string, authorId: string, data: IModerateCommentpayload, IsAdmin: boolean) => {
    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        }
    });

    if (!IsAdmin && comment.authorId !== authorId) {
        throw new Error("You are not authorized to moderate this comment");
    }

    const moderatedComment = await prisma.comment.update({
        where: {
            id: commentId
        },
        data
    });

    return moderatedComment

}

export const commentServices = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}