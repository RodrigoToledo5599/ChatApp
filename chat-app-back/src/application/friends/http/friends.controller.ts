import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../middleware/guards/auth.guard";
import { User } from "../../../middleware/decorators/user.decorator";
import { AddFriendUsecase } from "../usecases/add-friend.usecase";
import { ListFriendsUsecase } from "../usecases/list-friends.usecase";
import { FriendShipDeleteRequestDto, FriendShipDto } from "../dto/friendship.dto";
import { CreatedFriendShipDto } from "../dto/created-friendship.dto";
import { DeleteFriendshipRequestUsecase } from "../usecases/delete-friendship-request.usecase";


@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController{
    constructor(
        private readonly addFriendsUsecase: AddFriendUsecase,
        private readonly listFriendsUsecase: ListFriendsUsecase,
        private readonly deleteFriendshipUsecase : DeleteFriendshipRequestUsecase
    ){}

    @Post('')
    async addFriend(
        @User() user,
        @Body() body
    ):Promise<CreatedFriendShipDto>{
        if(!body.receiverId)
            throw new InternalServerErrorException('Não foi possível adicionar o usuário');
        return this.addFriendsUsecase.execute(user.id, body.receiverId)
    }

    @Get('')
    async listFriends(
        @User() user,
    ):Promise<FriendShipDto[]>{
        return await this.listFriendsUsecase.execute(user.id)
    }

    @Delete('')
    async deleteFriendShipRequest(
        @User() user,
        @Body() body?: FriendShipDeleteRequestDto
    ){
        if(!body || !body?.friendshipId)
            throw new BadRequestException('passe os parametros corretos');
        return await this.deleteFriendshipUsecase.execute(user.id, body.friendshipId)
    }
}   