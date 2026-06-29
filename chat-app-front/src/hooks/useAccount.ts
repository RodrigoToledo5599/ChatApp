import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountService } from "../api/services/account.service";
import type {CreateAccountRequestSend } from "../lib/types/create-account.types"



export function useCreateAccount(){

    return useMutation({
        mutationFn: (params: CreateAccountRequestSend) =>{
            const data = accountService.createAccount(params)
            return data
        }, 
            
        onSuccess: () => {
            toast.success("Conta criada com sucesso! 🎉") 
        },
        onError: (error) => {
           console.error("", error)
           toast.error("Erro ao se comunicar com o servidor")
        }
    })
}
