import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { TanStackKeys } from "../lib/tan-stack-keys";
import { conversationService } from "../api/services/conversation.service";
import type { ConversationMessagesRequestDto } from "../lib/types/conversations.types";

export function useGetUserConversations(){
    return useQuery({
        queryKey: [TanStackKeys.conversations],
        queryFn: () => conversationService.getUserConversations(),        
    })
}

export function useGetUserConversationMessages(params: ConversationMessagesRequestDto) {
  return useInfiniteQuery({
    queryKey: [TanStackKeys.conversation, params.conversationId],
    queryFn: ({ pageParam }) => {
      return conversationService.getConversationMessages({
        ...params,
        oldestMessageDate: pageParam, 
      })
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.oldestMessageDate || undefined
    },
    staleTime: 60000, // 10 minutos
    refetchOnWindowFocus: false,
    enabled: !!params.conversationId,
    retry: false
  })
}




