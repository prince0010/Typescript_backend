import { mergeTypeDefs } from "@graphql-tools/merge"

import { userSchema } from "./userSchema.js"
import { sharedSchema } from "./types.js"

export const typeDefs = mergeTypeDefs([
    userSchema,
    sharedSchema,
])