const gql = String.raw;

export const userSchema = gql`
    type User {
        _id: ID!
        firstName: String!
        middleName: String!
        lastName: String!
        employeeNumber: String!
        email: String!
        password: String!
    }

    input UserInput {
        firstName: String!
        middleName: String!
        lastName: String!
        email: String!
        password: String!
    }

    input createUserInput {
        firstName: String!
        middleName: String!
        lastName: String!
        email: String!
        password: String!
    }

    input updateUserInput {
        firstName: String
        middleName: String
        lastName: String
        email: String
        password: String
    }

    type Query {
        getUser(_id: ID!): User
        getUsers: [User]
    }

    type Mutation {
        createUser(input: UserInput!): User
        updateUser(_id: ID!, input: UserInput!): User
        deleteUser(_id: ID!): Boolean
    }

    type Subscription {
        onUserChange: Notification
    }
`;
