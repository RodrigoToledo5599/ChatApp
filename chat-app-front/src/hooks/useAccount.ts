import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountService } from "../api/services/account.service";
import type {CreateAccountRequestSend } from "../lib/types/create-account.types"



// o erro é exibido pela página, que mostra a mensagem do servidor
export function useCreateAccount(){

    return useMutation({
        mutationFn: (params: CreateAccountRequestSend) => accountService.createAccount(params), 
        onSuccess: () => {
            toast.success("Conta criada com sucesso! 🎉") 
        },
    })
}
