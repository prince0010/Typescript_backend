import { PubSub } from "graphql-subscriptions"
import { IAuthRequest } from "../interfaces/auth.js"
import { GraphQLError } from "graphql"
import { TRole } from "./types.js"

const pubsub = new PubSub()

// Error Handling
export const checkAuth = (context: IAuthRequest) => {
    if (!context.isAuth) {
        throw new GraphQLError("Invalid Authentication.", {
            extensions: { http: { status: 401 } },
        })
    }
}

// export const checkAuthProtectedRoles = (
//     context: IAuthRequest,
//     allowedRoles: TRole[]
// ) => {
//     if(!context.isAuth && !allowedRoles.includes(context.authRole as TRole))
//     {
//         throw new GraphQLError("You have no Access on this one.", {
//             extensions: {
//                 http:{
//                     status: 401
//                 }
//             }
//         })
//     }
// }