import { ObjectId } from "mongoose"
import { IUser } from "./user"
import { Token } from "graphql"

export interface IAuthRequest extends Request {
    authId?: ObjectId
    authRole?: string
    isAuth: boolean
}

export interface IAuth{
    password: string
}

export interface IAuthInput extends IAuth{
    username: string
}

export interface IPasswordInput {
    _id: ObjectId
    password: string
}

export interface ILog {
    user: IUser
    action: string
}

export interface IToken{
    token: Token
}
