import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FriendsRepository } from "../repository/friends.repository";
import { FriendshipStatus } from "@prisma/client";
import { WebSocketMessageService } from "../../../infra/websocket/websocket-message.service";



@Injectable()
export class AcceptOrRefuseFriendshiptUsecase{


    constructor(
        private friendsRepo: FriendsRepository,
        private wsService: WebSocketMessageService
    ) {}

    async execute(userId: string, friendshipId: string, accepted: boolean){

        const friendShip = await this.friendsRepo.findFriendShipRequest(friendshipId)

        if(!friendShip || (friendShip.senderId !== userId && friendShip.receiverId !== userId))
            throw new NotFoundException("A solicitação de amizade não foi encontrada")

        if(friendShip.receiverId !== userId || friendShip.status !== FriendshipStatus.PENDING)
            throw new ForbiddenException("Ação não permitida")

        const result = accepted
            ? await this.friendsRepo.acceptFriendShipRequest(friendshipId)
            : await this.friendsRepo.deleteFriendShip(friendshipId)

        this.wsService.notifyUsers([friendShip.senderId], 'friends_updated')
        return result
    }
}
