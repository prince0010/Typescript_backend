import { authApi } from "./authApi.js"
import { userApi } from "./userApi.js"

export const dataSources = {
    User: new userApi(),
    Auth: new authApi(),
}