import type { LoginParams, User, UserLoginReturn } from "../../lib/types/auth.types"
import { http } from "../http"




const ENDPOINT = "/auth"

export const authService = {

    login: async (params: LoginParams) : Promise<UserLoginReturn> => {
        const {data} = await http.post<UserLoginReturn>(ENDPOINT+"/login", params);
        return data
    },

    getMe: async () : Promise<User> => {
        const {data} = await http.get<User>(ENDPOINT+"/me");
        return data
    }


}