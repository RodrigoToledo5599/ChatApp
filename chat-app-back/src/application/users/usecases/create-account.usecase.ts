import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AccountRepository } from "../repository/account.repository";
import argon2 from "argon2";
import { AccountCreateRequestDto } from "../dto/account-create-request.dto";
import { AccountCreateResponseDto } from "../dto/account-create-response.dto";





@Injectable()
export class CreateAccountUsecase{

    constructor(
        private accountRepo: AccountRepository
    ){}

    async execute(data: AccountCreateRequestDto) : Promise<AccountCreateRequestDto>{
        if(!data.email || !data.name || !data.password)
            throw new BadRequestException("Preencha todos os campos obrigatórios")

        const userEmailAlreadyExistent = await this.accountRepo.findAccountByEmail(data.email)
        if(userEmailAlreadyExistent)
            throw new BadRequestException("email já existente")
        
        try{

            const hashedPassword = await argon2.hash(data.password, {
                type: argon2.argon2id,
                memoryCost: 65536,
                timeCost: 3,
                parallelism: 2,
            });

            const accountToBeCreated = new AccountCreateRequestDto(
                data.name,
                data.email,
                hashedPassword,
                data.phone ?? ""
            )

            const accountCreated = await this.accountRepo.createAccount(accountToBeCreated);
            if(accountCreated){
                const result = new AccountCreateResponseDto(accountCreated)
                return result
            }
            else
                throw new InternalServerErrorException('Não foi possível criar o usuário');
            
        }catch(e){
            throw new InternalServerErrorException('Não foi possível criar o usuário');
        }
    }
}