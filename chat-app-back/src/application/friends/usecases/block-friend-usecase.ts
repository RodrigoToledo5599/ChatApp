import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { FriendsRepository } from "../repository/friends.repository";
import { FriendShipRawDto } from "../dto/friendship.dto";





@Injectable()

export class BlockFriendUsecase{
    constructor(
        private friendsRepo: FriendsRepository
    ) {}

    async execute(userid: string, friendshipId: string){
        const friendShipRequest = await this.friendsRepo.findFriendShipRequest(friendshipId["friendshipId"])
                
        if(!friendShipRequest)
            throw new InternalServerErrorException("a solicitação não pode ser concluída")

        if(friendShipRequest.receiverId === userid || friendShipRequest.senderId === userid){
            const result = this.friendsRepo.blockFriend(friendshipId["friendshipId"])
            return await result; 
        }
        
        else
            throw new InternalServerErrorException("a solicitação não pode ser concluída")

    
        
    }
}