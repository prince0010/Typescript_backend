import dotenv from 'dotenv'
import { PubSub } from 'graphql-subscriptions'
import { IUserInput, IUser } from '../../interfaces/user'
import { IAuthRequest } from '../../interfaces/auth'
import { IDataSource } from '../../interfaces/context'
import { checkAuth } from '../../constants/action'

dotenv.config()
const pubsub = new PubSub()

export const userResolvers = {
    Query: {
        fetchUser: async(
            _: any,
            { _id }: IUserInput,
            context: IAuthRequest & IDataSource
        ): Promise<IUser> => {
            checkAuth(context)
            try{
                return await context.dataSources.User.fetchUser(_id)
            } catch (error) {
                throw error
            }
        },
        // fetchUsers: async(
        //     _: any,
        //     __: any,
        //     context: IAuthRequest & IDataSource
        // ): Promise<IUser[]> => {
        //     checkAuth(context)
        //     try{
        //         return await context.dataSources.User.fetchUsers()
        //     } catch (error) {
        //         throw error
        //     }
        // }
        Mutation: {
            createUser: async(
                _: any,
                { input }: { input: IUserInput },
                context: IAuthRequest & IDataSource
            ): Promise<IUser> => {
                checkAuth(context)
                try{
                    const user = await context.dataSources.User.
                }
            }
        }
    }
};