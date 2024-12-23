import { Request } from "express";
import { Document, ObjectId } from "mongoose"

// Data Type sa mga entities
export interface IUser extends Document{
    id: string
    firstName: string
    middleName: string
    lastName: string
    employeeNumber: string
    email: string
    password: string
    isActive: boolean
    isDeleted: boolean
    dateBirth: Date
}

export interface IUserInput extends Request{
    _id: ObjectId
    firstName: string
    middleName: string
    lastName: string
    employeeNumber: string
    email: string
    // password: string
    dateBirth: Date
}

export interface IUserRequest extends Request {
    user?: IUser;
}
