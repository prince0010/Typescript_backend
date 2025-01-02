import dotenv from "dotenv"
import jose from "node-jose"
import { IAuthInput, IAuthRequest, IToken, IUpdatePasswordInput } from "../../interfaces/auth.js"
import { IDataSource } from "../../interfaces/context.js"
import User from "../../models/user.js"
import { GraphQLError } from "graphql"
import {  IUser } from "../../interfaces/user.js"
import { checkAuth } from "../../constants/action.js"
import { ObjectId } from "mongoose"

dotenv.config()

export const authResolver = {
    Query: {
        login: async (
            _: any,
            input: IAuthInput,
            context: IAuthInput & IDataSource
         ): Promise<jose.JWS.CreateSignResult> => {
            const user = await User.findOne({ employeeNumber: input.employeeNumber })
            if (!user){
                throw new GraphQLError("Employee Number Does Not Exist.", {
                    extensions: {
                        field: "employeeNumber",
                        http: { status: 400 },
                    },
                })
            }
            return await context.dataSources.Auth.login(input)
        },
        logout: async (
            _: any, 
            { token }: IToken,
            context: IAuthRequest & IDataSource,
        ): Promise<IUser> => {
            console.log("Received Token:", token)
            checkAuth(context)
            try{
                const user = await context.dataSources.Auth.logout(token)
                
                return user
            }catch(error){
                throw error
        }
        },
        verifyPassword: async(
            _: any,
            input: IUpdatePasswordInput,
            context: IAuthRequest & IDataSource
        ): Promise<boolean> => {
            checkAuth(context)
            try{
                return context.dataSources.Auth.verifyPassword(input)
            }catch(error){
                throw error
            }
        },
        // Logs
        // logs: async()
    },
    Mutation:{
        updatePassword: async(
            _:any,
            input:IUpdatePasswordInput,
            context: IAuthRequest & IDataSource
        ) => {
            checkAuth(context)

            const user = await context.dataSources.User.fetchUser(context.authId as ObjectId)

            if(user.role !== "admin"){
                throw new GraphQLError("You are not authorized to perform this action.", {
                    extensions: {
                        http: { status: 401 },
                    },
                })
            }
            
            try{
                const User = await context.dataSources.Auth.updatePassword(input)
                // const actionUser = await context.dataSources.User.fetchUser(
                //     context.authId as ObjectId
                //   )
                //   await createLogAndPublish(
                //     actionUser,
                //     `Changed user password: ${user.lastName}, ${user.firstName}`,
                //     context,
                //     "USER_SUB",
                //     "userSub",
                //     "info"
                //   )
                return User
            }catch(error){
                throw error
            }
        },
    },
}