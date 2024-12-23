import { userApi } from "../graphql/api/userApi"


export interface IDataSource extends Request {
    dataSources: {
        User: userApi
    }
}