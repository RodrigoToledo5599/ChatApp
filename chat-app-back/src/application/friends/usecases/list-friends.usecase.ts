import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { FriendsRepository } from "../repository/friends.repository";
import { FriendShipDto } from "../dto/friendship.dto";





@Injectable()
export class ListFriendsUsecase{

    constructor(
        private friendsRepo: FriendsRepository
    ){}

    async execute(userid: string): Promise<FriendShipDto[]> {
        try {
            const friendsReturn = await this.friendsRepo.listFriends(userid);

            if (!friendsReturn) 
                throw new InternalServerErrorException('Não foi possível listar as amizades');
            
            
            const result = friendsReturn.map((item) => {
                if (item.senderId === userid) 
                    return new FriendShipDto(item, item.receiver.name, item.receiver.email);
                else
                    return new FriendShipDto(item, item.sender.name, item.sender.email);
            });

            return result;
        } catch (e) {
        // É bom manter o erro original no console do servidor para você conseguir debugar se der ruim
        console.error(e);
        throw new InternalServerErrorException('Não foi possível listar as amizades');
        }
    }

}