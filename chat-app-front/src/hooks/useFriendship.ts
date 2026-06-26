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
            toast.info("Amizade recusada") 
        },
        onError: (error) => {
           console.error("Erro ao cancelar solicitação:", error)
           toast.error("erro ao se comunicar com o servidor")
        }
    })
}


