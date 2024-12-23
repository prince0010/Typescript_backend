const gql = String.raw

export const sharedSchema = gql`

    enum NotificationType {
        success
        error
        info
        warning
    }

    type Notification {
        user: User!
        action: String!
        type: NotificationType
    }
`
