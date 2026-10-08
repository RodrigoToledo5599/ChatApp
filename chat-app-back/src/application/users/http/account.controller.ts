import { Body, Controller, Post } from "@nestjs/common";
import { CreateAccountUsecase } from "../usecases/create-account.usecase";
import { AccountCreateRequestDto } from "../dto/account-create-request.dto";
import { AccountCreateResponseDto } from "../dto/account-create-response.dto";
import { ApiBody, ApiOkResponse } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";


@Controller('account')
export class AccountController{

    constructor(
        private createAccountUseCase : CreateAccountUsecase
    ){}

    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    @ApiOkResponse({type: AccountCreateResponseDto})
    @ApiBody({type: AccountCreateRequestDto})
    @Post()
    async createAccount(@Body() data: AccountCreateRequestDto): Promise<AccountCreateResponseDto>{
        return await this.createAccountUseCase.execute(data)
    }

}