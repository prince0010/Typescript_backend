import dotenv from "dotenv"
import jose from "node-jose"
import { IAuthInput, IAuthRequest, IPasswordInput, IToken } from "../../interfaces/auth"
import { IDataSource } from "../../interfaces/context"
import user from "../../models/user"
import { GraphQLError } from "graphql"
import { IUser } from "../../interfaces/user"
import { checkAuth } from "../../constants/action"


dotenv.config()

export const authResolver = {
    Query: {
        login: async (
            _:any,
            input: IAuthInput,
            context: IAuthInput & IDataSource
         ): Promise<jose.JWS.CreateSignResult> => {
            const User = await user.findOne({ employeeNumber: input.employeeNumber })
            if(!User){
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
            input: IPasswordInput,
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
        changePassword: async(
            _:any,
            input:IPasswordInput,
            context: IAuthRequest & IDataSource
        ) => {
            checkAuth(context)
            try{
                const User = await context.dataSources.Auth.changePasword(input)
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
        }
    },
}