import { mergeTypeDefs } from "@graphql-tools/merge"

import { userSchema } from "./userSchema"
import { sharedSchema } from "./types"

export const typeDefs = mergeTypeDefs([
    userSchema,
    sharedSchema,
])