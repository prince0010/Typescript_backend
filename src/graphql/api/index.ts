import { authApi } from "./authApi"
import { userApi } from "./userApi"

export const dataSources = {
    User: new userApi(),
    Auth: new authApi(),
}