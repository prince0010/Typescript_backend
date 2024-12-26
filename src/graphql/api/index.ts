import { authApi } from "./authApi.js"
import { userApi } from "./userApi.js"

export const dataSources = {
    Auth: new authApi(),
    User: new userApi(),
}