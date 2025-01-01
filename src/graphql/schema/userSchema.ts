const gql = String.raw;

export const userSchema = gql`
    scalar Date

    type User {
        _id: ID!
        firstName: String!
        middleName: String!
        lastName: String!
        employeeNumber: String!
        isActive: Boolean!
        isDeleted: Boolean!
        email: String!
        # password: String!
        dateBirth: Date!
    }

    input UserInput {
        firstName: String!
        middleName: String!
        lastName: String!
        email: String!
        employeeNumber: String!
        # password: String!
        dateBirth: Date!
    }

    input createUserInput {
        firstName: String!
        middleName: String!
        lastName: String!
        email: String!
        employeeNumber: String!
        # password: String!
        dateBirth: Date!
    }

    input updateUserInput {
        _id: ID!
        firstName: String!
        middleName: String!
        lastName: String!
        employeeNumber: String!
        email: String!
        # password: String
        dateBirth: Date!
    }

    input updateProfileInput {
        _id: ID!
        firstName: String
        middleName: String
        lastName: String
        email: String
        employeeNumber: String
        dateBirth: Date
    }


    type Query {
        fetchUser(_id: ID!): User
        fetchUsers(status: Boolean, limit: Int): [User]
    }

    type Mutation {
        createUser(input: createUserInput!): User
        updateUser(input: updateUserInput!): User
        updatePassword(_id: ID!, password: String!): User
        updateProfile(input: updateProfileInput!): User
        # deleteUser(_id: ID!): Boolean
        softDeleteUser(_id: ID!): Boolean
        hardDeleteUser(_id: ID!): Boolean
        activateUser(_id: ID!): Boolean
    }

    type Subscription {
        onUserChange: Notification
    }
`;
