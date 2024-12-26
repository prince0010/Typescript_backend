import { ObjectId } from "mongoose"
import { IUser } from "./user.js"
import { Token } from "graphql"
import { Request } from "express"

export interface IAuthRequest extends Request {
    authId?: ObjectId
    authRole?: string
    isAuth?: boolean
}

export interface IAuth{
    password: string
}

export interface IAuthInput extends IAuth{
    employeeNumber: string
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
