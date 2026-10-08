import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AuthGuard } from "../../../middleware/guards/auth.guard";
import { User } from "../../../middleware/decorators/user.decorator";
import { FindUserByIdUsecase } from "../usecases/find-user-by-id.usecase";
import { SearchUsersUsecase } from "../usecases/search-users.usecase";
import { UserDto } from "../dto/user.dto";
import { ApiOkResponse, ApiParam, ApiQuery } from "@nestjs/swagger";


@UseGuards(AuthGuard)
@Controller('users')
export class UsersController{

    constructor(
        private findUserByIdUsecase: FindUserByIdUsecase,
        private searchUsersUsecase: SearchUsersUsecase
    ){}

    @Throttle({ default: { limit: 20, ttl: 60_000 } })
    @ApiQuery({name: 'q', type: String, description: 'parte do nome ou e-mail exato'})
    @ApiOkResponse({type: [UserDto]})
    @Get('search')
    async searchUsers(
        @User() user,
        @Query('q') q: string
    ): Promise<UserDto[]>{
        return await this.searchUsersUsecase.execute(user.id, q)
    }

    @ApiParam({name: 'id', type: String})
    @ApiOkResponse({type: UserDto})
    @Get(':id')
    async searchUsersById(
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<UserDto>{
        return await this.findUserByIdUsecase.execute(id)
    }
}
