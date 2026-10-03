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