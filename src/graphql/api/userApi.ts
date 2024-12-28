import { RESTDataSource } from "@apollo/datasource-rest"
import { ObjectId } from "mongoose"
import { IUser, IUserInput } from "../../interfaces/user.js"
import User from "../../models/user.js"
import { GraphQLError } from "graphql"
import { ITableQueryParams } from "../../interfaces/params.js"
import bcyrpt from "bcryptjs"
import user from "../../models/user.js"

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
        try {

            const { dateBirth, employeeNumber, password } = input
            
            if(!dateBirth || isNaN(new Date(dateBirth).getTime())){
                throw new GraphQLError("Invalid Date of Birth Format")
            }

            if(!employeeNumber || employeeNumber.length < 4) {
                throw new GraphQLError("Employee Number must be at least 4 characters")
            }

            if(!password || password.length < 6) {
                throw new GraphQLError("Passowrd must be atleast 6 characters long.")
            }

            const hashedPassword = await bcyrpt.hash(password, 10)

            const newUser = await user.create({
                ...input,
                password: hashedPassword,
            })

            return newUser
        }catch(error){
            console.error("Error creating user:", error)
            throw error
            
        }
    }
    // Update User
    updateUser = async (input: IUserInput): Promise<IUser> => {
        try{
            const user = await User.findById(input._id, input, {
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
        }
        catch (error: any){
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
        }catch (error){
            throw error
        }
    }
}