import { ConflictException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AccountRepository } from "../repository/account.repository";
import argon2 from "argon2";
import { AccountCreateRequestDto } from "../dto/account-create-request.dto";
import { AccountCreateResponseDto } from "../dto/account-create-response.dto";



@Injectable()
export class CreateAccountUsecase{

    constructor(
        private accountRepo: AccountRepository
    ){}

    async execute(data: AccountCreateRequestDto) : Promise<AccountCreateResponseDto>{
        const userEmailAlreadyExistent = await this.accountRepo.findAccountByEmail(data.email)
        if(userEmailAlreadyExistent)
            throw new ConflictException("E-mail já cadastrado")

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
            data.phone
        )

        try{
            const accountCreated = await this.accountRepo.createAccount(accountToBeCreated);
            return new AccountCreateResponseDto(accountCreated)
        }catch(e){
            // violação de unique (e-mail ou telefone já usados, inclusive em cadastros simultâneos)
            if(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
                throw new ConflictException('E-mail ou telefone já cadastrado');
            throw e
        }
    }
}
