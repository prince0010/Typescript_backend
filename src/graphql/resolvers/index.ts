import { mergeResolvers } from "@graphql-tools/merge"

import { userResolvers } from "./userResolvers"


export const resolvers = mergeResolvers([
    userResolvers
])