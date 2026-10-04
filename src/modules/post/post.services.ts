import { prisma } from "../../lib/prisma";
import { IcreatePostPaload } from "./post.interface"

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
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    });

    const updatedPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            views: {
                increment: 1
            }
        },
        include: {
            author: {
                select: {
                    name: true,
                    email: true
                }
            },
            comments: true
        },

    });

    return updatedPost;
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
}
const getPostStats = async () => {

}


const updatePost = async () => {
}
const deletePost = async () => {
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