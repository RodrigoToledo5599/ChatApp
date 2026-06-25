import { authService } from "../api/services/auth.service";
import { queryClient } from "../App";
import { TanStackKeys } from "../lib/tan-stack-keys";
import type { LoginParams, UserLoginReturn } from "../lib/types/auth.types";
import { useMutation, useQuery } from "@tanstack/react-query";



export function useLogin() {
  return useMutation({
    mutationFn: (params: LoginParams) => authService.login(params),
    onSuccess: (data :UserLoginReturn) =>{
        queryClient.setQueryData([TanStackKeys.user], data.user);
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