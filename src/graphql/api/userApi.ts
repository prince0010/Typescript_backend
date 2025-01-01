import { RESTDataSource } from "@apollo/datasource-rest"
import mongoose, { ObjectId } from "mongoose"
import { IUpdatePasswordInput, IUser, IUserInput } from "../../interfaces/user.js"
import User from "../../models/user.js"
import { GraphQLError } from "graphql"
import { ITableQueryParams } from "../../interfaces/params.js"
import bcyrpt from "bcryptjs"

export class userApi extends RESTDataSource {
    fetchUser = async (_id: ObjectId): Promise<IUser> => {
        try{
            const user = await User.findById(_id)
            if(!user){
                throw new GraphQLError("User not found.", {
                    extensions: { http: { status: 404 }},
                })
            }
            return user
        } catch (error){
            throw error
        }
    } 
    fetchUsers = async ({
        isActive = true,
        isDeleted = false,
        maxResult = 10,
        sortBy = 'createdAt',
        sortDirection = 'asc',
    }: ITableQueryParams): Promise<IUser[]> => {
        try{
        const query: any = {};

        if (isActive !== undefined) query.isActive = isActive;

        if (isDeleted !== undefined) query.isDeleted = isDeleted;

        const sortOptions:any = {};
        if (sortBy) {
            sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
        }
        
        const users = await User.find(query)
            .sort(sortOptions)
            .limit(maxResult)

            return users;
        } catch (error){
            throw error;
        }
    }
    //function to create a user
    createUser = async (input: IUserInput): Promise<IUser> => {
        try{

            const { dateBirth, employeeNumber } = input;

            if (!dateBirth || isNaN(new Date(dateBirth).getTime())){
                throw new GraphQLError("Invalid Datebirth Format,")
            }

            if(!employeeNumber || employeeNumber.length < 4) {
                throw new GraphQLError("Employee Number must be at least 4 characters.")
            } 

            const birthDate = new Date(dateBirth)
            const birthMonth = (birthDate.getMonth() + 1).toString().padStart(2, '0') // last 2 digits sa birthday month niya
            const birthYear = birthDate.getFullYear().toString().slice(-2) // last 2 digit sa birthyear niya
            const empLastTwoChar = employeeNumber.slice(-2) // employee Number last 2 char

            const rawPassword = `${birthMonth}${birthYear}${empLastTwoChar}`
            const hashedPassword = await bcyrpt.hash(rawPassword, 10)

            // himo user
            const newUser = await User.create({
                ...input,
                password: hashedPassword,
            })

            return newUser
        } catch (error){
            throw error
        }
    }
    // Update User / Profile
    updateUser = async (input: IUserInput): Promise<IUser> => {
        try{
            console.log("Updating User with input: sheshh", input)
            console.log("Type of _id:", typeof input._id)

            const user = await User.findByIdAndUpdate(input._id, input, {
                new: true, 
            })

            if (!user)
                throw new GraphQLError("User not found.", {
                    extensions: { 
                        http: 
                        { 
                            status: 404 
                        }
                    },
                })

            return user
        }catch (error: any){
            if (error.name === "ValidationError"){
                const validationErrors = Object.values(error.errors).map(
                    (err:any) => ({
                        path: err.path,
                        message: err.message,
                    })
                )
                throw new GraphQLError("Invalid Input Data", {
                    extensions: {
                        http: {
                            status: 400,
                        },
                        errors: validationErrors
                    },
                })
            }
            throw error
        }
    }
    // Update Password
    updatePassword = async (
       input: IUpdatePasswordInput
    ): Promise <void> => {
            try {
                const user = await User.findById(input._id)

                if(!user){
                    throw new GraphQLError("User not found.", {
                        extensions: {
                            http: {
                                status: 404,
                            }
                        }
                    })
                }

                const isMatch = await bcyrpt.compare(input.currentPassword, user.password)
                if(!isMatch){
                    throw new GraphQLError("Current Password is incorrect.", {
                        extensions:{
                            http: {
                                status: 400,
                            }
                        }
                    })
                }

                user.password = await bcyrpt.hash(input.newPassword, 10)
                await user.save()
            } catch (error) {
                throw error
            }
    }

     // updateProfile
    // updateProfile = async (_id: ObjectId): Promise<IUser> => {
    //     try{
    // }


    // Delete the User
    // deleteUser = async (_id: ObjectId): Promise<void> => {
    //     try{
    //         const user = await User.findByIdAndDelete(_id)

    //         if(!user){
    //             throw new GraphQLError('User not found.', {
    //                 extensions: {
    //                     http:{
    //                         status: 404,
    //                     }
    //                 },
    //             })
    //         }
    //     } catch (error){
    //         throw error
    //     }
    // }

   

    // Soft Delete
    softDeleteUser = async (_id: ObjectId): Promise<void> => {
        try{
            const user = await User.findById(_id)

            if(!user){
                throw new GraphQLError('User not found', {
                    extensions: {
                        http: { 
                            status: 404,
                        }
                    }
                })
            }

            if(user.isDeleted){
                throw new GraphQLError('User is already deleted', {
                    extensions: {
                        http: {
                            status: 400,
                        }
                    }
                })
            }

            user.isDeleted = true
            user.isActive = false
            await user.save()
        }catch (error){
            throw error
        }
    }

    // Hard Delete User
    hardDeleteUser = async (_id: ObjectId): Promise<void> => {
        try{
            const user = await User.findByIdAndDelete(_id)

            if(!user){
                throw new GraphQLError('User not found', {
                    extensions: {
                        http: {
                            status: 404,
                        }
                    }
                })
            }

        }catch (error){
            throw error
        }
    }

    // Activate User
    activateUser = async(_id: ObjectId): Promise<void> =>{
        try{
            const user = await User.findById(_id)

            if(!user){
                throw new GraphQLError('User is not found', {
                    extensions: {
                        http: {
                            status: 404,
                        }
                    }
                })
            }
            if(!user.isDeleted){
                throw new GraphQLError('User is already activated',{
                    extensions: {
                        http: {
                            status: 400,
                        }
                    }
                })
            }   

            user.isDeleted = false
            user.isActive = true
            await user.save()
        }catch (error){
            throw error
        }
    }
    // add a update Password and Reset Password with a Role of Admin 2 Roles Admin and Users need to be added
}