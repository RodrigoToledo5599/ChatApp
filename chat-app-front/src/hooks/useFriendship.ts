import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TanStackKeys } from "../lib/tan-stack-keys";
import { friendshipService } from "../api/services/friendship.service";
import { getApiErrorMessage } from "../lib/utils";
import axios from 'axios'
import { toast } from "sonner";



export function useGetUserFriends() {
    return useQuery({
        queryKey: [TanStackKeys.friends],
        queryFn: () => friendshipService.listFriends(),
        retry: false,
        // a lista é invalidada pelo socket (friends_updated) e pelas mutations abaixo
        staleTime: Infinity,
    })
}


// cancela um pedido enviado ou desfaz uma amizade aceita
export function useDeleteFriendship(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (params: { friendshipId: string, successMessage: string }) =>
            friendshipService.deleteFriendship(params.friendshipId),
        onSuccess: (_data, params) => {
            queryClient.invalidateQueries({ queryKey: [TanStackKeys.friends]})
            toast.info(params.successMessage) 
        },
        onError: (error) => {
           console.error("Erro ao remover amizade:", error)
           toast.error(getApiErrorMessage(error, "Erro ao se comunicar com o servidor"))
        }
    })
}


export function useSendFriendshipRequest(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (receiverId: string) => friendshipService.sendFriendshipRequest(receiverId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TanStackKeys.friends]})
            toast.info("Pedido de amizade enviado com sucesso") 
        },
        onError: (error) => {
            console.error("Erro ao enviar solicitação:", error)
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.error("Vocês já são amigos ou já existe um pedido pendente")
            } else {
                toast.error(getApiErrorMessage(error, "Erro ao se comunicar com o servidor"))
            }
        }
    })
}


interface AcceptOrRefuseFriendshipRequestSend {
    friendshipId: string,
    accepted: boolean
}

export function useAcceptOrRefuseFriendshipRequest(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (params: AcceptOrRefuseFriendshipRequestSend) =>
            friendshipService.acceptOrRefuseFriendshipRequest(params.friendshipId, params.accepted),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TanStackKeys.friends]})
        },
        onError: (error) => {
           console.error("Erro ao responder solicitação:", error)
           toast.error(getApiErrorMessage(error, "Erro ao se comunicar com o servidor"))
        }
    })
}


export function useBlockFriendRequest(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (friendshipId: string) => friendshipService.blockFriendRequest(friendshipId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TanStackKeys.friends]})
            toast.info("Usuário bloqueado")
        },
        onError: (error) => {
           console.error("Erro ao bloquear:", error)
           toast.error(getApiErrorMessage(error, "Erro ao se comunicar com o servidor"))
        }
    })
}


export function useUnblockFriend(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (friendshipId: string) => friendshipService.unblockFriend(friendshipId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TanStackKeys.friends]})
            toast.info("Usuário desbloqueado")
        },
        onError: (error) => {
           console.error("Erro ao desbloquear:", error)
           toast.error(getApiErrorMessage(error, "Erro ao se comunicar com o servidor"))
        }
    })
}
