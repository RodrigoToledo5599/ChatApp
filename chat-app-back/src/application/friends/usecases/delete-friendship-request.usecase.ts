import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FriendshipStatus } from "@prisma/client";
import { FriendsRepository } from "../repository/friends.repository";
import { WebSocketMessageService } from "../../../infra/websocket/websocket-message.service";



// cancela um pedido enviado (só quem enviou) ou desfaz uma amizade aceita (qualquer um dos dois)
@Injectable()
export class DeleteFriendshipRequestUsecase{


    constructor(
        private friendsRepo: FriendsRepository,
        private wsService: WebSocketMessageService
    ) {}

    async execute(userId: string, friendShipRequestId: string){

        const friendShip = await this.friendsRepo.findFriendShipRequest(friendShipRequestId)

        if(!friendShip || (friendShip.senderId !== userId && friendShip.receiverId !== userId))
            throw new NotFoundException("A amizade ou solicitação não foi encontrada")

        const canDelete =
            (friendShip.status === FriendshipStatus.PENDING && friendShip.senderId === userId) ||
            friendShip.status === FriendshipStatus.ACCEPTED

        if(!canDelete)
            throw new ForbiddenException("Ação não permitida")

        const result = await this.friendsRepo.deleteFriendShip(friendShipRequestId)
        this.wsService.notifyUsers([friendShip.senderId, friendShip.receiverId], 'friends_updated')
        return result
    }
}
