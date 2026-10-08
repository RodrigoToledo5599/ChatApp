import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { FriendshipStatus } from "@prisma/client";
import { FriendsRepository } from "../repository/friends.repository";
import { WebSocketMessageService } from "../../../infra/websocket/websocket-message.service";



@Injectable()
export class BlockFriendUsecase{
    constructor(
        private friendsRepo: FriendsRepository,
        private wsService: WebSocketMessageService
    ) {}

    async execute(userid: string, friendshipId: string){
        const friendShip = await this.friendsRepo.findFriendShipRequest(friendshipId)

        if(!friendShip || (friendShip.receiverId !== userid && friendShip.senderId !== userid))
            throw new NotFoundException("A amizade não foi encontrada")

        // quem foi bloqueado não pode "re-bloquear" para assumir o controle do bloqueio
        if(friendShip.status === FriendshipStatus.BLOCKED)
            throw new ForbiddenException("Esta amizade já está bloqueada")

        const result = await this.friendsRepo.blockFriend(friendshipId, userid)
        this.wsService.notifyUsers([friendShip.senderId, friendShip.receiverId], 'friends_updated')
        return result
    }
}
