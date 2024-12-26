import dotenv from 'dotenv'
import { PubSub } from "graphql-subscriptions"
import { IUserInput, IUser } from '../../interfaces/user.js'
import { IAuthRequest } from '../../interfaces/auth.js'
import { IDataSource } from '../../interfaces/context.js'
import { checkAuth } from '../../constants/action.js'
import { ITableQueryParams } from '../../interfaces/params.js'
import { ObjectId } from 'mongoose'
import { subscribe } from 'diagnostics_channel'

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
        fetchUsers: async(
            _: any,
            input: ITableQueryParams,
            context: IAuthRequest & IDataSource
        ): Promise<IUser[]> => {
            checkAuth(context)
            try{
                return await context.dataSources.User.fetchUsers(input)
            } catch (error) {
                throw error
            }
        },
    },
        Mutation: {
            createUser: async(
                _: any,
                { input }: { input: IUserInput },
                context: IAuthRequest & IDataSource
            ): Promise<IUser> => {
                // checkAuth(context)
                try{
                    const user = await context.dataSources.User.createUser(input)

                    const actionUser = await context.dataSources.User.fetchUser(
                        context.authId as ObjectId
                    )
                    // await createLogAndPublish(
                    //     actionUser,
                    //     `Created user: ${user.lastName}, ${user.firstName}`,
                    //     context,
                    //     'USER_SUB',
                    //     'userSub',
                    //     'success'
                    // )
                    return user
                } catch (error) {
                    throw error
                }
            },

            // Update User
            updateUser: async(
                _:any,
                { input }: { input: IUserInput },
                context: IAuthRequest & IDataSource
            ): Promise<IUser> => {
            checkAuth(context)
            try{
                const user = await context.dataSources.User.updateUser(input)
                const actionUser = await context.dataSources.User.fetchUser(
                    context.authId as ObjectId
                )

                // await createLogAndPublish(
                    //     actionUser,
                    //     `Created user: ${user.lastName}, ${user.firstName}`,
                    //     context,
                    //     'USER_SUB',
                    //     'userSub',
                    //     'success'
                    // )

                return user
            } catch (error) {
                throw error
            }
            },

            // Delete User
            // deleteUser: async (
            //     _:any,
            //     { _id }: { _id: ObjectId },
            //     context: IAuthRequest & IDataSource,
            // ): Promise<boolean> => {
            //     checkAuth(context)
            //     try{
            //         await context.dataSources.User.deleteUser(_id)

            //         return true
            //     }catch(error) {
            //         throw error
            //     }
            // }
            // Soft Delete
            softDeleteUser: async(
                _:any,
                { _id }: { _id: ObjectId },
                context: IAuthRequest & IDataSource
            ): Promise<boolean> =>{
                checkAuth(context)

                try{
                    await context.dataSources.User.softDeleteUser(_id)

                    return true
                }catch(error){
                    throw error
                }
            },

            // Hard Delete
            hardDeleteUser: async(
                _:any,
                { _id }: { _id: ObjectId },
                context: IAuthRequest & IDataSource
            ): Promise<boolean> => {
                checkAuth(context)

                try{
                    await context.dataSources.User.hardDeleteUser(_id)

                    // Log the actions
                    // const actionUser = await context.dataSources.User.fetchUser(
                    //     context.authId as ObjectId
                    // )
                    // await createLogAndPublish(
                    //     actionUser,
                    //     `Hard-deleted user with ID: ${_id}`,
                    //     context,
                    //     'USER_SUB',
                    //     'userSub',
                    //     'success'
                    //   );

                    return true
                }catch (error){
                    throw error
                }
            },
            // Retrieve User Data
            activateUser: async(
                _:any,
                { _id }: { _id: ObjectId },
                context: IAuthRequest & IDataSource
            ): Promise<boolean> => {
                checkAuth(context)

                try{
                    await context.dataSources.User.activateUser(_id)

                    return true
                } catch (error){
                    throw error
                }
            }
        },
    Subscription: {
        onUserChange: {
            // subscribe: () => pubsub.asyncIterator(["USER_SUB"]),
        },
    },
}