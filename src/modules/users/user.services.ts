import { prisma } from "../../lib/prisma";
import config from "../../config";
import bcrypt from "bcryptjs";
import { registerUserpayload } from "./user.interface";



const registeruserIntoDB = async (payload: registerUserpayload) => {
    const { name, email, password, profilePhoto } = payload
    const isExitUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (isExitUser) {
        throw new Error("User already exist")
    }
    const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_Salt_Rounds))

    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            profile: {
                create: {
                    profilePhoto
                }
            }
        }
    })

    // await prisma.profile.create({
    //     data: {
    //         userId: createUser.id,
    //         profilePhoto
    //     }
    // })

    const user = await prisma.user.findUnique({
        where: {
            id: createUser.id,
            email: createUser.email
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    })

    return user
}

const getmyprofile = (userId: string) => {
    const user = prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }

    })

    return user;

}

export const userService = {
    registeruserIntoDB,
    getmyprofile
}