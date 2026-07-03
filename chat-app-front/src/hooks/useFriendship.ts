import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TanStackKeys } from "../lib/tan-stack-keys";
import { friendshipService } from "../api/services/friendship.service";
import { toast } from "sonner";




export function useGetUserFriends() {
    return useQuery({
        queryKey: [TanStackKeys.friends],
        queryFn: () => friendshipService.listFriends(),
        retry: false,
        staleTime: Infinity,
    })
}


export function useDeleteFriendshipRequest(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (friendshipRequestId: string) =>{
            const data = friendshipService.deleteFriendshipRequest(friendshipRequestId)
            return data
        }, 
            
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TanStackKeys.friends]})
            toast.info("Pedido de amizade cancelado com sucesso") 
        },
        onError: (error) => {
           console.error("Erro ao cancelar solicitação:", error)
           toast.error("erro ao se comunicar com o servidor")
        }
    })
}


export function useSendFriendshipRequest(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (receiverId: string) =>{
            const data = friendshipService.sendFriendshipRequest(receiverId)
            return data
        }, 
            
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TanStackKeys.friends]})
            toast.info("Pedido de amizade enviado com sucesso") 
        },
        onError: (error) => {
           console.error("Erro ao enviar solicitação:", error)
           toast.error("erro ao se comunicar com o servidor")
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
        mutationFn: (params: AcceptOrRefuseFriendshipRequestSend) =>{
            const data = friendshipService.useAcceptOrRefuseFriendshipRequest(params.friendshipId, params.accepted)
            return data
        }, 
            
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TanStackKeys.friends]})
        },
        onError: (error) => {
           console.error("Erro ao cancelar solicitação:", error)
           toast.error("erro ao se comunicar com o servidor")
        }
    })
}


export function useBlockFriendRequest(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (friendshipId: string) =>{
            const data = friendshipService.blockFriendRequest(friendshipId)
            return data
        }, 
            
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [TanStackKeys.friends]})
        },
        onError: (error) => {
           console.error("Erro ao cancelar solicitação:", error)
           toast.error("erro ao se comunicar com o servidor")
        }
    })
}



