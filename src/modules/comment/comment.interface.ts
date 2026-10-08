import { CommentStatus } from "../../../generated/prisma/enums";

export interface IcreateCommentpayload {
    postId: string;
    authorId: string;
    content: string;
};

export interface IupdateCommentpayload {
    content?: string;
    status?: CommentStatus;
};

export interface IModerateCommentpayload {
    status: CommentStatus;
}