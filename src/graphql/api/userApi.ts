import { RESTDataSource } from "@apollo/datasource-rest"
import { ObjectId } from "mongoose"
import { IUser, IUserInput } from "../../interfaces/user"
import User from "../../models/user"
import { GraphQLError } from "graphql"


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

    // fetchUsers = async (): Promise<IUser[]> => {

    // }

    createUser = async (input: IUserInput): Promise<IUser> => {
        try{
            const newUser = await User.create({
                
            })
        }
    }

}