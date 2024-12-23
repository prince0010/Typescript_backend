import { mergeResolvers } from "@graphql-tools/merge"

import { userResolvers } from "./userResolvers.js"


export const resolvers = mergeResolvers([
    userResolvers
])