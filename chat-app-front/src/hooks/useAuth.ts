import { useNavigate } from "react-router-dom";
import { authService } from "../api/services/auth.service";
import { TanStackKeys } from "../lib/tan-stack-keys";
import { socket } from "../lib/socket";
import type { LoginParams, UserLoginReturn } from "../lib/types/auth.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: LoginParams) => authService.login(params),
    onSuccess: (data :UserLoginReturn) =>{
        // descarta o cache e a conexão de uma conta anterior antes de guardar o novo usuário
        socket.disconnect()
        queryClient.clear()
        queryClient.setQueryData([TanStackKeys.user], data.user);
    }
  });
}

export function useLoginWithGoogle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credential: string) => authService.loginWithGoogle(credential),
    onSuccess: (data :UserLoginReturn) =>{
        socket.disconnect()
        queryClient.clear()
        queryClient.setQueryData([TanStackKeys.user], data.user);
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authService.logout(),
    // mesmo se a chamada falhar, a sessão local é encerrada
    onSettled: () => {
        socket.disconnect()
        queryClient.clear()
        navigate("/")
    }
  });
}

export function useMe() {
    return useQuery({
        queryKey: [TanStackKeys.user],
        queryFn: () => authService.getMe(),
        retry: false,
        staleTime: Infinity,
    })
}
