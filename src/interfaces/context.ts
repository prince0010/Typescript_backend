import { userApi } from "../graphql/api/userApi.js"


export interface IDataSource extends Request {
    dataSources: {
        User: userApi
    }
}