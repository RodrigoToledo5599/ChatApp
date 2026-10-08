import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { FriendsRepository } from "../repository/friends.repository";
import { CreatedFriendShipDto } from "../dto/created-friendship.dto";
import { WebSocketMessageService } from "../../../infra/websocket/websocket-message.service";



@Injectable()
export class AddFriendUsecase{
    constructor(
        private friendsRepo: FriendsRepository,
        private wsService: WebSocketMessageService
    ){}

    async execute(senderId: string, receiverId: string ):Promise<CreatedFriendShipDto>{
        if (senderId === receiverId)
            throw new BadRequestException("Você não pode adicionar a si mesmo");

        if (!(await this.friendsRepo.userExists(receiverId)))
            throw new NotFoundException("Usuário não encontrado");

        const friendShipFound = await this.friendsRepo.findFriendship(senderId,receiverId)
        if(friendShipFound)
            throw new ConflictException("Já existe uma amizade ou solicitação entre vocês");

        try{
            const addedFriend = await this.friendsRepo.addFriend(senderId,receiverId)
            this.wsService.notifyUsers([receiverId], 'friends_updated')
            return new CreatedFriendShipDto(addedFriend)
        }catch(e){
            // pedido simultâneo entre os mesmos usuários
            if(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
                throw new ConflictException("Já existe uma amizade ou solicitação entre vocês");
            throw e
        }
    }
}
