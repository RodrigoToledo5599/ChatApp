import { Body, Controller, Post } from "@nestjs/common";
import { CreateAccountUsecase } from "../usecases/create-account.usecase";
import { AccountCreateRequestDto } from "../dto/account-create-request.dto";
import { AccountCreateResponseDto } from "../dto/account-create-response.dto";






@Controller('account')
export class AccountController{

    constructor(
        private createAccountUseCase : CreateAccountUsecase
    ){}

    @Post()
    async createAccount(@Body() data: AccountCreateResponseDto): Promise<AccountCreateRequestDto>{
        return await this.createAccountUseCase.execute(data)
    }

}