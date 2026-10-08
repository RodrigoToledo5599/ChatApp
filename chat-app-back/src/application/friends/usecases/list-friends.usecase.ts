import { Injectable } from "@nestjs/common";
import { FriendsRepository } from "../repository/friends.repository";
import { FriendShipDto } from "../dto/friendship.dto";



@Injectable()
export class ListFriendsUsecase{

    constructor(
        private friendsRepo: FriendsRepository
    ){}

    async execute(userid: string): Promise<FriendShipDto[]> {
        const friendsReturn = await this.friendsRepo.listFriends(userid);

        return friendsReturn.map((item) => {
            const otherUser = item.senderId === userid ? item.receiver : item.sender;
            return new FriendShipDto(item, otherUser.name, otherUser.email);
        });
    }

}
