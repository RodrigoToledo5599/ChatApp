





import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { FriendsRepository } from "../repository/friends.repository";
import { FriendShipRawDto } from "../dto/friendship.dto";
import { FriendshipStatus } from "@prisma/client";







@Injectable()
export class AcceptOrRefuseFriendshiptUsecase{

    
    constructor(
        private friendsRepo: FriendsRepository
    ) {}

    async execute(userId: string, friendshipId: string, accepted: boolean){

        const friendShipRequest = await this.friendsRepo.findFriendShipRequest(friendshipId["friendshipId"])
        
        if(!friendShipRequest)
            throw new NotFoundException("a solicitação de amizade não pode ser encontrada")
        
        const friendShip = new FriendShipRawDto(friendShipRequest)
        
        if(friendShip.receiverId === userId && friendShip.status === FriendshipStatus.PENDING){
            return accepted === true?
                await this.friendsRepo.acceptFriendShipRequest(friendshipId["friendshipId"])
                :
                await this.friendsRepo.deleteFriendShip(friendshipId["friendshipId"])
        }
        else
            throw new InternalServerErrorException("Ação foi impossibilitada")


        


    }
}