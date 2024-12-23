import dotenv from "dotenv"
import { IAuthRequest } from "../interfaces/auth"
import { NextFunction, Response } from "express"


dotenv.config()

export default async(
    request: IAuthRequest,
    _: Response,
    next: NextFunction,
): Promise<void> => {
    
}














