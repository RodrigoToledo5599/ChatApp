import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConversationsRepository } from "../repository/conversations.repository";







@Injectable()
export class GetFriendConversationUsecase{
    
    constructor(
        private  conversationsRepo: ConversationsRepository
    ) {}


    async execute(userid: string, friendId: string){
        try{
            if(userid === friendId)
                throw new InternalServerErrorException("os 2 são os mesmos usuários")
            
            let conversation = await this.conversationsRepo.findDirectConversation(userid,friendId)
            if(!conversation)
                conversation = await this.conversationsRepo.createConversationBetween2Users(userid,friendId)
            return conversation
        }catch(err){
            throw new InternalServerErrorException("Server Error")
        }
            
    }
}