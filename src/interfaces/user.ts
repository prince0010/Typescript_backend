import { Request } from "express";
import { Document, ObjectId } from "mongoose"
import { TRole } from "../constants/types"

// Data Type sa mga entities
export interface IUser extends Document {
    _id: ObjectId
    firstName: string
    middleName: string
    lastName: string
    employeeNumber: string
    email: string
    password: string
    isActive: boolean
    isDeleted: boolean
    dateBirth: Date
    role: TRole
}

export interface IUserInput extends Request{
    _id: ObjectId
    firstName: string
    middleName: string
    lastName: string
    employeeNumber: string
    email: string
    dateBirth: Date
    role: TRole
}



// export interface IUserRequest extends Request {
//     user?: IUser;
// }
