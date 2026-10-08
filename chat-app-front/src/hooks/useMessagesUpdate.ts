import { useEffect } from "react"
import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query" 
import { TanStackKeys } from "../lib/tan-stack-keys"
import { conversationService } from "../api/services/conversation.service"
import { socket } from "../lib/socket"
import { getApiErrorMessage } from "../lib/utils"
import type { ConversationMessagesResponseDto, MessageDto } from "../lib/types/conversations.types"
import axios from "axios"
import { toast } from "sonner"


interface SendMessageParams {
    conversationId: string,
    content: string
}

export function useSendMessage() {

    return useMutation({
        mutationFn: (params: SendMessageParams) =>{
            const data = conversationService.sendMessage(params.conversationId, params.content)
            return data
        }, 
        
        onError: (error) => {
           console.error("Erro ao enviar mensagem:", error)
           if (axios.isAxiosError(error) && error.response?.status === 403)
               toast.error("Você não pode enviar mensagens nesta conversa")
           else
               toast.error(getApiErrorMessage(error, "Não foi possível enviar a mensagem"))
        }
    })
}

export function useMessagesUpdate(conversationId: string) {
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!conversationId) return

        // entra (de novo) na sala a cada conexão: ao reconectar, o servidor não lembra das salas antigas
        const joinChat = () => socket.emit("join_chat", { conversationId })

        const onMessage = (newMessage: MessageDto) => {
            if (newMessage.conversationId !== conversationId) return

            queryClient.setQueryData<InfiniteData<ConversationMessagesResponseDto>>(
                [TanStackKeys.conversation, conversationId],
                (oldData) => {
                    if (!oldData) return oldData

                    const alreadyLoaded = oldData.pages.some((page) =>
                        page.data.some((m) => m._id === newMessage._id)
                    )
                    if (alreadyLoaded) return oldData

                    // pages[0] é a página mais recente
                    const updatedPages = [...oldData.pages]
                    updatedPages[0] = {
                        ...updatedPages[0],
                        data: [...updatedPages[0].data, newMessage]
                    }

                    return {
                        ...oldData,
                        pages: updatedPages
                    }
                }
            )
        }

        socket.on("connect", joinChat)
        socket.on("messages", onMessage)
        if (socket.connected) joinChat()

        return () => {
            socket.off("connect", joinChat)
            socket.off("messages", onMessage)
            socket.emit("leave_chat", { conversationId })
        }

    }, [conversationId, queryClient])
}
