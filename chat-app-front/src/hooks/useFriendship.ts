import { useQuery } from "@tanstack/react-query";
import { TanStackKeys } from "../lib/tan-stack-keys";
import { friendshipService } from "../api/services/friendship.service";




export function useGetUserFriends() {
    return useQuery({
        queryKey: [TanStackKeys.friends],
        queryFn: () => friendshipService.listFriends(),
        retry: false,
        staleTime: Infinity,
    })
}


export function useGetUserPendingFriends() {
    return useQuery({
        queryKey: [TanStackKeys.pending_friends],
        queryFn: () => friendshipService.listFriends(),
        retry: false,
        staleTime: Infinity,
    })
}