import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConversationsRepository } from "../repository/conversations.repository";
import { MessageDto, MessageDtoRequest } from "../dto/conversation-messages";
import { WebSocketMessageService } from "../../../infra/websocket/websocket-message.service";





@Injectable()
export class SendMessageUsecase{

    constructor(
        private conversationsRepo: ConversationsRepository,
        private wsEventsService: WebSocketMessageService,
    ){}

    async execute(userId: string, userName: string, params: MessageDtoRequest): Promise<MessageDto> {
        const userOnConversation = await this.conversationsRepo.checkIfUserIsAllowedOnConversation(userId,params.conversationId)
        if(!userOnConversation)
            throw new ForbiddenException( 'You are not allowed to send messages on this conversation');

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
        try {
            await this.wsEventsService.emitNewMessage(params.conversationId, result);
        } catch (e) {
            throw new InternalServerErrorException('Not possible to update, reload the page')
        }
        
        return result
    }

}