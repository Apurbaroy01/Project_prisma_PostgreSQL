import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"

const createPost = catchAsync( async (req: Request, res: Response, next: NextFunction) =>{
    
});

const getPosts = catchAsync( async (req: Request, res: Response, next: NextFunction) =>{
    
});

const getPostStats = catchAsync( async (req: Request, res: Response, next: NextFunction) =>{
    
});
const getMyPosts = catchAsync( async (req: Request, res: Response, next: NextFunction) =>{
    
} );
const getMyPostById = catchAsync( async (req: Request, res: Response, next: NextFunction) =>{
    
} );
const updatePost = catchAsync( async (req: Request, res: Response, next: NextFunction) =>{
    
} );
const deletePost = catchAsync( async (req: Request, res: Response, next: NextFunction) =>{
    
} );

export const postController = {
    createPost,
    getPosts,
    getPostStats,
    getMyPosts,
    getMyPostById,
    updatePost,
    deletePost
}
