import { Request } from "express";
import { Document, ObjectId } from "mongoose"

export interface IUser extends Document{
    id: string
    firstName: string
    middleName: string
    lastName: string
    employeeNumber: string
    email: string
    password: string

}

export interface IUserInput extends Request{
    _id: ObjectId
    firstName: string
    middleName: string
    lastName: string
    email: string
    password: string
}

export interface IUserRequest extends Request {
    user?: IUser;
}