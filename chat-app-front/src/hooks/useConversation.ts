import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TanStackKeys } from "../lib/tan-stack-keys";
import { conversationService } from "../api/services/conversation.service";
import type { ConversationMessagesRequestDto } from "../lib/types/conversations.types";
import { toast } from "sonner";

export function useGetUserConversations(){
    return useQuery({
        queryKey: [TanStackKeys.conversations],
        queryFn: () => conversationService.getUserConversations(),        
    })
}

export function useCreateGroupConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, memberIds }: { title: string; memberIds: string[] }) => {
      return conversationService.createGroupConversation(title, memberIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TanStackKeys.conversations] });
      toast.success('Grupo criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar grupo:', error);
      toast.error('Não foi possível criar o grupo.');
    },
  });
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




