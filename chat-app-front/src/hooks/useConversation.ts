import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TanStackKeys } from "../lib/tan-stack-keys";
import { conversationService } from "../api/services/conversation.service";
import type { ConversationMessagesRequestDto } from "../lib/types/conversations.types";
import { getApiErrorMessage } from "../lib/utils";
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
      toast.error(getApiErrorMessage(error, 'Não foi possível criar o grupo.'));
    },
  });
}

export function useGetUserConversationMessages(params: Omit<ConversationMessagesRequestDto, "cursor">) {
  return useInfiniteQuery({
    queryKey: [TanStackKeys.conversation, params.conversationId],
    queryFn: ({ pageParam }) => {
      return conversationService.getConversationMessages({
        ...params,
        cursor: pageParam, 
      })
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60_000, // 1 minuto; mensagens novas chegam pelo socket
    refetchOnWindowFocus: false,
    enabled: !!params.conversationId,
    retry: false
  })
}
