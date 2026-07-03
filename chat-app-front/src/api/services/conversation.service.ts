import type { ConversationMessagesRequestDto, ConversationMessagesResponseDto, ConversationReturn } from "../../lib/types/conversations.types"
import { http } from "../http"




const ENDPOINT = "/conversations"

export const conversationService = {

    getUserConversations: async (): Promise<ConversationReturn[]> => {
        const { data } = await http.get<ConversationReturn[]>(ENDPOINT);
        
        // Trava a execução por 1000 milissegundos (1 segundos)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return data;
    },

    getConversationMessages: async (params :ConversationMessagesRequestDto): Promise<ConversationMessagesResponseDto> => {
        const {data} = await http.get<ConversationMessagesResponseDto>(ENDPOINT+"/messages",{params})
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return data;
    },
    
    getFriendConversation: async (friendId: string) => {
        const {data} = await http.get(ENDPOINT+`/friend-conversation/${friendId}`)
        return data
    },

    sendMessage: async (conversationId: string, content: string) => {
        const {data} = await http.post(ENDPOINT+`/messages`,{
            conversationId: conversationId, 
            content: content
        })
        return data
    }
}