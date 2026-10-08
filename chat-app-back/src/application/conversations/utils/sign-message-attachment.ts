import { StorageService } from "../../../infra/storage/storage.service"
import { MessageDto } from "../dto/conversation-messages"

// troca a key do bucket por uma url de leitura temporária; só chamar para quem já tem acesso à conversa
export async function signMessageAttachment(storage: StorageService, message: MessageDto): Promise<MessageDto> {
    if (!message.attachment?.key)
        return message

    const { key, ...attachment } = message.attachment
    return {
        ...message,
        attachment: { ...attachment, url: await storage.createDownloadUrl(key) },
    }
}
