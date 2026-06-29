import type { CreateAccountRequestSend } from "../../lib/types/create-account.types";
import { http } from "../http"




const ENDPOINT = "/account"

export const accountService = {

    createAccount: async (params: CreateAccountRequestSend) => {
        const {data} = await http.post(ENDPOINT, params);
        return data;
    }
}