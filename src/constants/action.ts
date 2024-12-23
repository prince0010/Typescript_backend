import { PubSub } from "graphql-subscriptions"
import { IAuthRequest } from "../interfaces/auth.js"
import { GraphQLError } from "graphql"

const pubsub = new PubSub()

// Error Handling
export const checkAuth = (context: IAuthRequest) => {
    if (!context.isAuth) {
        throw new GraphQLError("Invalid Authentication.", {
            extensions: { http: { status: 401 } },
        })
    }
}