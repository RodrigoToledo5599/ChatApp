import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../../middleware/guards/auth.guard";
import { FindUserByIdUsecase } from "../usecases/find-user-by-id.usecase";
import { FindUserByEmailUsecase } from "../usecases/find-user-by-email.usecase";
import { FindUserByNameUsecase } from "../usecases/find-user-by-name.usecase";
import { UserDto } from "../dto/user.dto";


@UseGuards(AuthGuard)
@Controller('users')
export class UsersController{

    constructor(
        private findUserByIdUsecase: FindUserByIdUsecase,
        private findUserByEmailUsecase: FindUserByEmailUsecase,
        private findUserByNameUsecase: FindUserByNameUsecase
    ){}

    @Get('name=:name')
    async searchUsersByName(
        @Param('name') name: string
    ): Promise<UserDto[]>{
        return await this.findUserByNameUsecase.execute(name)
    }

    @Get('email=:email')
    async searchUsersByEmail(
        @Param('email') email: string
    ): Promise<UserDto[]>{
        return await this.findUserByEmailUsecase.execute(email)
    }

    @Get('id=:id')
    async searchUsersById(
        @Param('id') id: string
    ): Promise<UserDto>{
        return await this.findUserByIdUsecase.execute(id)
    }
}