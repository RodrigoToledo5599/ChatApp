import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../middleware/guards/auth.guard";
import { User } from "../../../middleware/decorators/user.decorator";
import { AddFriendUsecase } from "../usecases/add-friend.usecase";
import { ListFriendsUsecase } from "../usecases/list-friends.usecase";
import { AddFriendRequestDto, FriendShipDto } from "../dto/friendship.dto";
import { CreatedFriendShipDto } from "../dto/created-friendship.dto";
import { DeleteFriendshipRequestUsecase } from "../usecases/delete-friendship-request.usecase";
import { AcceptOrRefuseFriendshiptUsecase } from "../usecases/accept-or-refuse-friendship.usecase";
import { BlockFriendUsecase } from "../usecases/block-friend-usecase";
import { UnblockFriendUsecase } from "../usecases/unblock-friend.usecase";
import { ApiBody, ApiOkResponse, ApiParam } from "@nestjs/swagger";


@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController{
    constructor(
        private readonly addFriendsUsecase: AddFriendUsecase,
        private readonly listFriendsUsecase: ListFriendsUsecase,
        private readonly deleteFriendshipUsecase: DeleteFriendshipRequestUsecase,
        private readonly acceptOrRefuseFriendshipUsecase: AcceptOrRefuseFriendshiptUsecase,
        private readonly blockAFriendUsecase: BlockFriendUsecase,
        private readonly unblockFriendUsecase: UnblockFriendUsecase
    ){}

    @ApiOkResponse({type: CreatedFriendShipDto})
    @ApiBody({type: AddFriendRequestDto})
    @Post('')
    async addFriend(
        @User() user,
        @Body() body: AddFriendRequestDto
    ):Promise<CreatedFriendShipDto>{
        return this.addFriendsUsecase.execute(user.id, body.receiverId)
    }

    @ApiOkResponse({type: [FriendShipDto]})
    @Get('')
    async listFriends(
        @User() user,
    ):Promise<FriendShipDto[]>{
        return await this.listFriendsUsecase.execute(user.id)
    }

    // cancela um pedido enviado ou desfaz uma amizade
    @ApiParam({name: 'friendshipId', type: String})
    @Delete(':friendshipId')
    async deleteFriendShipRequest(
        @User() user,
        @Param('friendshipId', ParseUUIDPipe) friendshipId: string
    ){
        return await this.deleteFriendshipUsecase.execute(user.id, friendshipId)
    }

    @ApiParam({name: 'friendshipId', type: String})
    @Patch('accept/:friendshipId')
    async acceptFriendshipRequest(
        @User() user,
        @Param('friendshipId', ParseUUIDPipe) friendshipId: string
    ){
        return await this.acceptOrRefuseFriendshipUsecase.execute(user.id,friendshipId,true);
    }

    @ApiParam({name: 'friendshipId', type: String})
    @Delete('refuse/:friendshipId')
    async refuseFriendshipRequest(
        @User() user,
        @Param('friendshipId', ParseUUIDPipe) friendshipId: string
    ){
        return await this.acceptOrRefuseFriendshipUsecase.execute(user.id,friendshipId,false);
    }

    @ApiParam({name: 'friendshipId', type: String})
    @Patch('block/:friendshipId')
    async blockFriend(
        @User() user,
        @Param('friendshipId', ParseUUIDPipe) friendshipId: string
    ){
        return await this.blockAFriendUsecase.execute(user.id,friendshipId);
    }

    @ApiParam({name: 'friendshipId', type: String})
    @Patch('unblock/:friendshipId')
    async unblockFriend(
        @User() user,
        @Param('friendshipId', ParseUUIDPipe) friendshipId: string
    ){
        return await this.unblockFriendUsecase.execute(user.id,friendshipId);
    }

}
