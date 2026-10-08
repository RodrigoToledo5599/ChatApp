import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FriendshipStatus } from "@prisma/client";
import { FriendsRepository } from "../repository/friends.repository";
import { WebSocketMessageService } from "../../../infra/websocket/websocket-message.service";



// desbloquear remove a relação: para voltarem a ser amigos, um novo pedido precisa ser enviado
@Injectable()
export class UnblockFriendUsecase{
    constructor(
        private friendsRepo: FriendsRepository,
        private wsService: WebSocketMessageService
    ) {}

    async execute(userid: string, friendshipId: string){
        const friendShip = await this.friendsRepo.findFriendShipRequest(friendshipId)

        if(!friendShip || (friendShip.receiverId !== userid && friendShip.senderId !== userid))
            throw new NotFoundException("A amizade não foi encontrada")

        if(friendShip.status !== FriendshipStatus.BLOCKED)
            throw new ForbiddenException("Esta amizade não está bloqueada")

        // bloqueios antigos não têm autor registrado: qualquer um dos dois pode desfazer
        if(friendShip.blockedById && friendShip.blockedById !== userid)
            throw new NotFoundException("A amizade não foi encontrada")

        const result = await this.friendsRepo.deleteFriendShip(friendshipId)
        this.wsService.notifyUsers([friendShip.senderId, friendShip.receiverId], 'friends_updated')
        return result
    }
}
