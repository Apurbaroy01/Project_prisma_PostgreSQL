import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
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
        // exat match


        // where: {
        //     AND: [
        //         { title: "my six post" },
        //         { status: PostStatus.PUBLISHED },
        //         { tags:{
        //             has: "typescript"
        //         }}
        //     ]
        // },

        // partial match with or condition
        // where: {
        //     OR: [
        //         { title: { contains: "my six", mode: "insensitive" }},
        //         { content: { contains: "my six", mode: "insensitive" }},
        //     ]
        // },

        // combining search or filter
        where: {
            AND: [
                {
                    OR: [
                        { title: { contains: "my six", mode: "insensitive" } },
                        { content: { contains: "my six", mode: "insensitive" } },
                    ]
                },
                { title: "my six", },
                { content: "my six" },
            ]
        },

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
    const transationResult = await prisma.$transaction(async (prisma) => {

        const [totalPosts, totalPublishedPosts, totalDraftPosts, totalArchivedPosts, totalComments, totalApprovedComments, totalRejectedComments, totalViews] = await Promise.all([
            await prisma.post.count(),

            await prisma.post.count({
                where: {
                    status: PostStatus.PUBLISHED
                }
            }),

            await prisma.post.count({
                where: {
                    status: PostStatus.DRAFT
                }
            }),

            await prisma.post.count({
                where: {
                    status: PostStatus.ARCHIVED
                }
            }),

            await prisma.comment.count(),

            await prisma.comment.count({
                where: {
                    status: CommentStatus.APPROVED
                }
            }),

            await prisma.comment.count({
                where: {
                    status: CommentStatus.REJECTED
                }
            }),

            await prisma.post.aggregate({
                _sum: {
                    views: true
                }
            })
        ])

        return {
            totalPosts,
            totalPublishedPosts,
            totalDraftPosts,
            totalArchivedPosts,
            totalComments,
            totalApprovedComments,
            totalRejectedComments,
            totalViews: totalViews._sum?.views
        }
    })
    return transationResult

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