import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IcreatePostPaload, IGetPostsQuery, iUpdatePostPayload } from "./post.interface"

const createPost = async (postData: IcreatePostPaload, userId: string) => {

    const result = await prisma.post.create({
        data: {
            ...postData,
            authorId: userId
        }
    })

    return result

};



const getPosts = async (query: IGetPostsQuery) => {
    const limit = query.limit ? parseInt(query.limit) : 10;
    const page = query.page ? parseInt(query.page) : 1;
    const skip = (page - 1) * limit;

    const conditions: PostWhereInput[] = []
    if (query.searchTrem){
        conditions.push({
            OR: [
                { title: { contains: query.searchTrem, mode: "insensitive" } },
                { content: { contains: query.searchTrem, mode: "insensitive" } },
            ]
        })
    };
    if (query.title){
        conditions.push({ title: query.title })
    };
    if (query.content){
        conditions.push({ content: query.content })
    };


    const posts = await prisma.post.findMany({
        // where: {
        //     AND: [
        //         query.searchTrem ? {
        //             OR: [
        //                 { title: { contains: query.searchTrem, mode: "insensitive" } },
        //                 { content: { contains: query.searchTrem, mode: "insensitive" } },
        //             ]
        //         } : {},

        //         query.title ? { title: query.title } : {},
        //         query.content ? { content: query.content } : {}
        //     ]
        // },

        where: {
            AND: conditions
        },
        take: limit,
        skip: skip,
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