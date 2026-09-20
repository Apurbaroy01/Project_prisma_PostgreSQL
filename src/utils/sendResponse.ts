import { Response } from "express"

type TMeta = {
    page: number,
    size: number,
    total: number
}

type TResponseData<T> = {
    statusCode: number,
    success: boolean,
    message: string,
    data: T
    meta?: TMeta
}

export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
        meta: data.meta 
    })
}