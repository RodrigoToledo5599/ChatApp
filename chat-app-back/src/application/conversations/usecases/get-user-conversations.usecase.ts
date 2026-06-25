import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConversationsRepository } from "../repository/conversations.repository";
import { ConversationDto } from "../dto/conversation.dto";





@Injectable()
export class GetUserConversationsUsecase{

    constructor(
        private  conversationsRepo: ConversationsRepository
    ){}


    async execute(userId: string): Promise<ConversationDto[]>{
        
        const conversations = await this.conversationsRepo.getMyConversations(userId)

        if(!conversations)
            throw new InternalServerErrorException('Não foi possível listar as conversas');

        return conversations.map((item) => new ConversationDto(item));
        
    }

}