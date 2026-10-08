import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { FriendshipStatus } from "@prisma/client";
import { ConversationsRepository } from "../repository/conversations.repository";
import { MessageAttachmentDto, MessageDto, MessageDtoRequest } from "../dto/conversation-messages";
import { WebSocketMessageService } from "../../../infra/websocket/websocket-message.service";
import { ConfirmAttachmentUsecase } from "../../attachments/usecases/confirm-attachment.usecase";
import { StorageService } from "../../../infra/storage/storage.service";
import { signMessageAttachment } from "../utils/sign-message-attachment";





@Injectable()
export class SendMessageUsecase{
    private readonly logger = new Logger(SendMessageUsecase.name)

    constructor(
        private conversationsRepo: ConversationsRepository,
        private wsEventsService: WebSocketMessageService,
        private confirmAttachmentUsecase: ConfirmAttachmentUsecase,
        private storage: StorageService,
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

        // só depois das checagens de permissão: o anexo é consumido aqui e não pode ser reaproveitado
        let attachment: MessageAttachmentDto | undefined
        if(params.attachmentId){
            const confirmed = await this.confirmAttachmentUsecase.execute(userId, params.conversationId, params.attachmentId)
            attachment = {
                id: confirmed.id,
                key: confirmed.key,
                mimeType: confirmed.mimeType,
                size: confirmed.size,
                width: confirmed.width,
                height: confirmed.height,
            }
        }

        const createAt = new Date(Date.now())
        const updatedAt = createAt
        const newMessage = new MessageDto(
            params.conversationId,
            userId,
            userName,
            params.content ?? '',
            createAt,
            updatedAt,
            undefined,
            attachment
        )
        
        
        const saved = await this.conversationsRepo.createMessage(newMessage)
        const result = await signMessageAttachment(this.storage, saved)
        // a mensagem já foi salva: uma falha no socket não deve virar erro para quem enviou
        try {
            await this.wsEventsService.emitNewMessage(params.conversationId, result);
        } catch (e) {
            this.logger.error(`Falha ao emitir mensagem da conversa ${params.conversationId}`, e as Error)
        }
        
        return result
    }

}