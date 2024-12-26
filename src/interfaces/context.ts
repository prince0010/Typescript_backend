import { authApi } from "../graphql/api/authApi.js"
import { userApi } from "../graphql/api/userApi.js"


export interface IDataSource extends Request {
    dataSources: {
        Auth: authApi
        User: userApi
    }
}