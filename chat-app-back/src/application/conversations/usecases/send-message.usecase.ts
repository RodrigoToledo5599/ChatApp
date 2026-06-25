import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConversationsRepository } from "../repository/conversations.repository";
import { MessageDto } from "../dto/conversation-messages";





@Injectable()
export class SendMessageUsecase{

    constructor(
        private  conversationsRepo: ConversationsRepository
    ){}

    async execute(userId: string,params: MessageDto){
        
        const userOnConversation = await this.conversationsRepo.checkIfUserIsAllowedOnConversation(userId,params.conversationId)
        
        if(!userOnConversation)
            throw new ForbiddenException( 'You are not allowed to send messages on this conversation');
        
        const result = await this.conversationsRepo.createMessage(params)
        return result
        
    }

}