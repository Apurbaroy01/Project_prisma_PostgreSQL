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

}

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
}

const getPostStats = async () => {

}

const getMyPosts = async () => {

}

const getMyPostById = async () => {
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