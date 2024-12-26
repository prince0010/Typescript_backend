import { mergeTypeDefs } from "@graphql-tools/merge"

import { userSchema } from "./userSchema.js"
import { sharedSchema } from "./types.js"
import { authSchema } from "./authSchema.js"

export const typeDefs = mergeTypeDefs([
    userSchema,
    authSchema,
    sharedSchema,
])