import { Schema, model, Document } from 'mongoose';
import { IUser } from '../interfaces/user.js'
import { roles } from '../constants/enums.js'

const UserModel = new Schema<IUser>({

    firstName: {
        type: String,
        required: [true, 'First name is required'],
    },
    middleName: {
        type: String,
        required: [true, 'Middle name is required'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
    employeeNumber: {
        type: String,
        required: [true, 'Employee number is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: (value: string) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                return emailRegex.test(value)
            },
            message: "Please provide a valid email address.",
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [10, "Password must be atleast 10 characters long"],
    },
    dateBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        required: true,
        enum: {
            values: Object.values(roles),
            message: "Select Roles",
        }
    },
    },
    {
        timestamps: true,
    },
    
);

export default model<IUser>("User", UserModel);