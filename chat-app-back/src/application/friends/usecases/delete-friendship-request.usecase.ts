import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { FriendsRepository } from "../repository/friends.repository";
import { FriendShipRawDto } from "../dto/friendship.dto";







@Injectable()
export class DeleteFriendshipRequestUsecase{

    
    constructor(
        private friendsRepo: FriendsRepository
    ) {}

    async execute(userId: string, friendShipRequestId: string){

        const friendShipRequest = await this.friendsRepo.findFriendShipRequest(friendShipRequestId)
        
        if(!friendShipRequest)
            throw new NotFoundException("a solicitação de amizade não pode ser encontrada")
        
        const friendShip = new FriendShipRawDto(friendShipRequest)
        
        if(friendShip.senderId === userId)
            return await this.friendsRepo.deleteFriendShip(friendShipRequestId)
        else
            throw new InternalServerErrorException("Ação foi impossibilitada")


    }
}