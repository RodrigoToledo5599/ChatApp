import { Body, Controller, Get, InternalServerErrorException, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../middleware/guards/auth.guard";
import { User } from "../../../middleware/decorators/user.decorator";
import { AddFriendUsecase } from "../usecases/add-friend.usecase";
import { ListFriendsUsecase } from "../usecases/list-friends.usecase";
import { FriendShipDto } from "../dto/friendship.dto";
import { CreatedFriendShipDto } from "../dto/created-friendship.dto";


@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController{
    constructor(
        private readonly addFriendsUseCase: AddFriendUsecase,
        private readonly listFriendsUseCase: ListFriendsUsecase 
    ){}

    @Post('')
    async addFriend(
        @User() user,
        @Body() body
    ):Promise<CreatedFriendShipDto>{
        if(!body.receiverId)
            throw new InternalServerErrorException('Não foi possível adicionar o usuário');
        return this.addFriendsUseCase.execute(user.id, body.receiverId)
    }

    @Get('')
    async listFriends(
        @User() user,
    ):Promise<FriendShipDto[]>{
        return await this.listFriendsUseCase.execute(user.id)
    }
}   