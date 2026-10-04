import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IcreatePostPaload, iUpdatePostPayload } from "./post.interface"

const createPost = async (postData: IcreatePostPaload, userId: string) => {

    const result = await prisma.post.create({
        data: {
            ...postData,
            authorId: userId
        }
    })

    return result

};

const getPosts = async () => {
    const posts = await prisma.post.findMany({
        include: {
            author: {
                select: {
                    name: true,
                    email: true
                }
            },
            comments: true
        }
    });
    return posts;
};

const getMyPostById = async (postId: string) => {

    const transactionResult = await prisma.$transaction(async (prisma) => {
        await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            },

        });

        const post = await prisma.post.findUniqueOrThrow({
            where: {
                id: postId
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                comments: {
                    where: {
                        status: CommentStatus.APPROVED
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            },
        })
        return post;
    })
    return transactionResult;
}

const getMyPosts = async (authorId: string) => {
    const posts = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            author: {
                select: {
                    name: true,
                    email: true
                }
            },
            comments: true,
            _count: {
                select: {
                    comments: true
                }
            }
        }

    });

    return posts;
};

const getPostStats = async () => {

};

const updatePost = async (postId: string, payLoad: iUpdatePostPayload, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });
    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not authorized to update this post");
    }

    const updatedPost = await prisma.post.update({

        where: {
            id: postId
        },
        data: payLoad
    })
    return updatedPost
};

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });
    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not authorized to delete this post");
    }
    const deletedPost = await prisma.post.delete({
        where: {
            id: postId
        }
    })
    return deletedPost

}

export const postService = {
    createPost,
    getPosts,
    getPostStats,
    getMyPosts,
    getMyPostById,
    updatePost,
    deletePost
}