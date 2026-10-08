import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ConversationsRepository } from "../repository/conversations.repository";
import { ConversationMessagesRequestDto, ConversationMessagesResponseDto, MessageDto } from "../dto/conversation-messages";
import { StorageService } from "../../../infra/storage/storage.service";
import { signMessageAttachment } from "../utils/sign-message-attachment";


// cursor = "<createdAt ISO>_<_id da mensagem>"
const encodeCursor = (message: MessageDto) => `${message.createdAt.toISOString()}_${message._id}`

function decodeCursor(cursor: string): { createdAt: Date, id: ObjectId } {
    const separator = cursor.lastIndexOf('_')
    const createdAt = new Date(cursor.slice(0, separator))
    const id = cursor.slice(separator + 1)
    if (separator < 0 || isNaN(createdAt.getTime()) || !ObjectId.isValid(id))
        throw new BadRequestException('Cursor inválido')
    return { createdAt, id: new ObjectId(id) }
}


@Injectable()
export class GetConversationMessagesUsecase{

    constructor(
        private  conversationsRepo: ConversationsRepository,
        private storage: StorageService,
    ){}

    async execute(userId: string,params: ConversationMessagesRequestDto):Promise<ConversationMessagesResponseDto>{

        const userOnConversation = await this.conversationsRepo.checkIfUserIsAllowedOnConversation(userId,params.conversationId)

        if(!userOnConversation)
            throw new ForbiddenException( 'You are not allowed to access this conversation',);

        const cursor = params.cursor ? decodeCursor(params.cursor) : undefined
        const conversations = await this.conversationsRepo.getConversationMessages(params.conversationId, params.limit, cursor)
        const messages: MessageDto[] = await Promise.all(conversations.map((item)=>{
            return signMessageAttachment(this.storage, new MessageDto(
                item.conversationId,
                item.userId,
                item.userName,
                item.content,
                item.createdAt,
                item.updatedAt,
                item._id,
                item.attachment
            ))
        }))

        // página incompleta = não há mensagens mais antigas
        const nextCursor = messages.length === params.limit
            ? encodeCursor(messages[0])
            : undefined;

        return new ConversationMessagesResponseDto(
            messages,
            userId,
            params.conversationId,
            params.limit,
            nextCursor
        )
    }

}
