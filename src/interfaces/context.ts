import { UserAPI } from "../graphql/api/authApi"


export interface IDataSource extends Request {
    dataSources: {
        User: UserAPI
    }
}