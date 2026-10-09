import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface IcreatePostPaload {
    title: string;
    content: string;
    thumbnail?: string;
    isFeatured?: boolean;
    status?: PostStatus;
    tags: string[];
}

export interface iUpdatePostPayload {
    title?: string;
    content?: string;
    thumbnail?: string;
    isFeatured?: boolean;
    status?: PostStatus;
    tags?: string[];
}


export interface IGetPostsQuery extends PostWhereInput {
    // title?: string;
    // content?: string;

    searchTrem?: string;
    page?: string;
    limit?: string;
}