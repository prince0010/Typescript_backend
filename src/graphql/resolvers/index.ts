import { mergeResolvers } from "@graphql-tools/merge"

import { userResolvers } from "./userResolvers.js"
import { authResolver } from "./authResolvers.js"


export const resolvers = mergeResolvers([
    userResolvers,
    authResolver,
])