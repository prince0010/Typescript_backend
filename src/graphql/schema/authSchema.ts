const gql = String.raw

export const authSchema = gql`

    scalar DateTime

    type Log {
       user: User!
       role: String!
       description: String!
       createdAt: DateTime!
       updatedAt: DateTime!
    }

    type Query {
        login(employeeNumber: String!, password: String!): String
        logout(token: String!): User!
        verifyPassword(_id: ID!, password: String!): Boolean!
        logs(limit: Int!): [Log]
    }

    type Mutation {
        changePassword(_id: ID!, password: String!): User
    }

`