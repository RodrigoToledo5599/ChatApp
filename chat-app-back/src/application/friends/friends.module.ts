import { Module } from '@nestjs/common';
import { FriendsController } from './http/friends.controller';
import { FriendsRepository } from './repository/friends.repository';
import { AddFriendUsecase } from './usecases/add-friend.usecase';
import { ListFriendsUsecase } from './usecases/list-friends.usecase';
import { DeleteFriendshipRequestUsecase } from './usecases/delete-friendship-request.usecase';

@Module({
    controllers: [
        FriendsController
    ],
    providers:[
        FriendsRepository,
        AddFriendUsecase,
        ListFriendsUsecase,
        DeleteFriendshipRequestUsecase
    ]
})
export class FriendsModule {}
