import { useEffect } from "react"
import { io } from "socket.io-client"
import { useMutation, useQueryClient } from "@tanstack/react-query" 
import { TanStackKeys } from "../lib/tan-stack-keys"
import { conversationService } from "../api/services/conversation.service"

// const socket = io("ws://localhost:3000/messages", {
const socket = io(import.meta.env.VITE_SOCKET_URL,{
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: false
})


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
           console.error("Erro ao cancelar solicitação:", error)
        }
    })
}

export function useMessagesUpdate(conversationId: string) {
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!conversationId) return

        socket.connect()
        socket.emit("join_chat", { conversationId })

        socket.on("messages", (newMessage) => {

            queryClient.setQueryData([TanStackKeys.conversation, conversationId], (oldData: any) => {
                if (!oldData) return oldData

                const updatedPages = [...oldData.pages]
                
                updatedPages[0] = {
                    ...updatedPages[0],
                    data: [...updatedPages[0].data, newMessage]
                }

                return {
                    ...oldData,
                    pages: updatedPages
                }
            })
        })

        return () => {
            socket.off("messages")
            socket.disconnect()
        }

    }, [conversationId, queryClient])
}