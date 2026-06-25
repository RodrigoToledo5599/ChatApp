import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { FriendsRepository } from "../repository/friends.repository";
import { FriendShipDto } from "../dto/friendship.dto";
import { CreatedFriendShipDto } from "../dto/created-friendship.dto";






@Injectable()
export class AddFriendUsecase{
    constructor(
        private friendsRepo: FriendsRepository
    ){}

    async execute(senderId: string, receiverId: string ):Promise<CreatedFriendShipDto>{
        if (senderId === receiverId)
            throw new BadRequestException();
        
        const friendShipFound = await this.friendsRepo.findFriendship(senderId,receiverId)
        if(friendShipFound)
            throw new ConflictException("Já existe uma solicitação de amizade pendente entre vocês");

        try{
            const addedFriend = await this.friendsRepo.addFriend(senderId,receiverId)
            if(!addedFriend)
                throw new InternalServerErrorException('Não foi possível adicionar o usuário');

            const result = new CreatedFriendShipDto(addedFriend)
            return result
        }catch(e){
            throw new InternalServerErrorException('Não foi possível adicionar o usuário');
        }   
        
    }
}