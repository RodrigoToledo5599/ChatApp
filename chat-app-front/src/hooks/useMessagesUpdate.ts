import { useCallback, useEffect, useState } from "react"
import { useMutation, useQueryClient, type InfiniteData, type QueryClient } from "@tanstack/react-query" 
import { TanStackKeys } from "../lib/tan-stack-keys"
import { conversationService } from "../api/services/conversation.service"
import { attachmentService } from "../api/services/attachment.service"
import { prepareImage } from "../lib/image"
import { socket } from "../lib/socket"
import { getApiErrorMessage } from "../lib/utils"
import type { ConversationMessagesResponseDto, MessageDto } from "../lib/types/conversations.types"
import axios from "axios"
import { toast } from "sonner"


// a mesma mensagem pode chegar pela resposta do POST e pelo socket; entra no cache uma vez só
function appendMessageToCache(queryClient: QueryClient, newMessage: MessageDto) {
    queryClient.setQueryData<InfiniteData<ConversationMessagesResponseDto>>(
        [TanStackKeys.conversation, newMessage.conversationId],
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
            appendMessageToCache(queryClient, newMessage)
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


// imagem que ainda está subindo; aparece no chat com o preview local até virar mensagem de verdade
export interface PendingImage {
    tempId: string
    conversationId: string
    previewUrl: string
    width: number
    height: number
    caption: string
    progress: number
}

interface SendImageParams {
    conversationId: string
    file: File
    caption: string
}

// fluxo: comprime no browser -> pede a url assinada à API -> envia direto para o bucket -> cria a mensagem com o attachmentId
export function useSendImage() {
    const queryClient = useQueryClient()
    const [pendingImages, setPendingImages] = useState<PendingImage[]>([])

    const sendImage = useCallback(async ({ conversationId, file, caption }: SendImageParams) => {
        let prepared
        try {
            prepared = await prepareImage(file)
        } catch (error) {
            toast.error((error as Error).message)
            return
        }

        // crypto.randomUUID só existe em contexto seguro (https/localhost)
        const tempId = `${Date.now()}-${Math.random()}`
        const previewUrl = URL.createObjectURL(prepared.blob)
        const updateProgress = (progress: number) =>
            setPendingImages((list) => list.map((p) => p.tempId === tempId ? { ...p, progress } : p))

        setPendingImages((list) => [...list, {
            tempId, conversationId, previewUrl, caption,
            width: prepared.width, height: prepared.height, progress: 0
        }])

        try {
            const { attachmentId, uploadUrl } = await attachmentService.requestUploadUrl({
                conversationId,
                mimeType: prepared.blob.type,
                size: prepared.blob.size,
                width: prepared.width,
                height: prepared.height,
            })
            await attachmentService.uploadToStorage(uploadUrl, prepared.blob, updateProgress)
            const message = await conversationService.sendMessage(conversationId, caption, attachmentId)
            appendMessageToCache(queryClient, message)
        } catch (error) {
            console.error("Erro ao enviar imagem:", error)
            if (axios.isAxiosError(error) && error.response?.status === 403)
                toast.error("Você não pode enviar imagens nesta conversa")
            else
                toast.error(getApiErrorMessage(error, "Não foi possível enviar a imagem"))
        } finally {
            setPendingImages((list) => list.filter((p) => p.tempId !== tempId))
            URL.revokeObjectURL(previewUrl)
        }
    }, [queryClient])

    return { pendingImages, sendImage }
}
