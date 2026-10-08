import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { FriendshipStatus } from "@prisma/client";
import { ConversationsRepository } from "../repository/conversations.repository";
import { MessageDto, MessageDtoRequest } from "../dto/conversation-messages";
import { WebSocketMessageService } from "../../../infra/websocket/websocket-message.service";





@Injectable()
export class SendMessageUsecase{
    private readonly logger = new Logger(SendMessageUsecase.name)

    constructor(
        private conversationsRepo: ConversationsRepository,
        private wsEventsService: WebSocketMessageService,
    ){}

    async execute(userId: string, userName: string, params: MessageDtoRequest): Promise<MessageDto> {
        const userOnConversation = await this.conversationsRepo.checkIfUserIsAllowedOnConversation(userId,params.conversationId)
        if(!userOnConversation)
            throw new ForbiddenException( 'You are not allowed to send messages on this conversation');

        // em conversas diretas, só é possível enviar mensagens enquanto a amizade estiver aceita (não bloqueada/desfeita)
        const conversation = await this.conversationsRepo.getConversationMembers(params.conversationId)
        if(conversation && !conversation.isGroup){
            const otherUser = conversation.users.find((u) => u.userId !== userId)
            const friendship = otherUser
                ? await this.conversationsRepo.findFriendshipBetween(userId, otherUser.userId)
                : null
            if(!friendship || friendship.status !== FriendshipStatus.ACCEPTED)
                throw new ForbiddenException('You can only send messages to friends')
        }

        const createAt = new Date(Date.now())
        const updatedAt = createAt
        const newMessage = new MessageDto(
            params.conversationId,
            userId,
            userName,
            params.content,
            createAt,
            updatedAt
        )
        
        
        const result = await this.conversationsRepo.createMessage(newMessage)
        // a mensagem já foi salva: uma falha no socket não deve virar erro para quem enviou
        try {
            await this.wsEventsService.emitNewMessage(params.conversationId, result);
        } catch (e) {
            this.logger.error(`Falha ao emitir mensagem da conversa ${params.conversationId}`, e as Error)
        }
        
        return result
    }

}