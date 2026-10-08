import type { ConversationMessagesRequestDto, ConversationMessagesResponseDto, ConversationReturn, MessageDto } from "../../lib/types/conversations.types"
import { http } from "../http"




const ENDPOINT = "/conversations"

export const conversationService = {

    getUserConversations: async (): Promise<ConversationReturn[]> => {
        const { data } = await http.get<ConversationReturn[]>(ENDPOINT);
        return data;
    },

    getConversationMessages: async (params :ConversationMessagesRequestDto): Promise<ConversationMessagesResponseDto> => {
        const {data} = await http.get<ConversationMessagesResponseDto>(ENDPOINT+"/messages",{params})
        return data;
    },
    
    getFriendConversation: async (friendId: string) => {
        const {data} = await http.get(ENDPOINT+`/friend-conversation/${encodeURIComponent(friendId)}`)
        return data
    },

    sendMessage: async (conversationId: string, content: string, attachmentId?: string): Promise<MessageDto> => {
        const {data} = await http.post<MessageDto>(ENDPOINT+`/messages`,{
            conversationId: conversationId, 
            content: content,
            attachmentId: attachmentId
        })
        return data
    },

    createGroupConversation: async (title: string, memberIds: string[]) => {
        const { data } = await http.post(`${ENDPOINT}/group`, {
            title,
            memberIds,
        });
        return data;
    }
}
