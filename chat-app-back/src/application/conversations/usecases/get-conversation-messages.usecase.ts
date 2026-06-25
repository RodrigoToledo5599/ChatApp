import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConversationsRepository } from "../repository/conversations.repository";
import { ConversationMessagesRequestDto, ConversationMessagesResponseDto, MessageDto } from "../dto/conversation-messages";


@Injectable()
export class GetConversationMessagesUsecase{

    constructor(
        private  conversationsRepo: ConversationsRepository
    ){}

    async execute(userId: string,params: ConversationMessagesRequestDto):Promise<ConversationMessagesResponseDto>{
        
        const userOnConversation = await this.conversationsRepo.checkIfUserIsAllowedOnConversation(userId,params.conversationId)
        
        if(!userOnConversation)
            throw new ForbiddenException( 'You are not allowed to access this conversation',);
        
        const conversations = await this.conversationsRepo.getConversationMessages(params)
        const messages: MessageDto[] = conversations.map((item)=>{
            return new MessageDto(
                item.conversationId,
                item.userId,
                item.userName,
                item.content,
                item.createdAt,
                item.updatedAt,
                item._id
            )
        })

        const nextOldestDate = messages.length > 0 
            ? messages[0].createdAt.toISOString() 
            : undefined;
        const result = new ConversationMessagesResponseDto(
            messages,
            userId,
            params.conversationId,
            params.limit,
            // params.oldestMessageDate
            nextOldestDate
            // messages[Number(params.limit)].createdAt.toString()
        )

        return result


    }

}