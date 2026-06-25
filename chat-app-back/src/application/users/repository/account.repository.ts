import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import { Users } from '@prisma/client';
import { AccountCreateRequestDto } from "../dto/account-create-request.dto";


@Injectable()
export class AccountRepository{
    constructor(
        private prisma: PrismaService
    ){}

    async findAccountByEmail(email: string) : Promise<Users | null>{
        return await this.prisma.users.findFirst({
            where: {
                email: email
            }
        })
    }

    async createAccount(data: AccountCreateRequestDto): Promise<Users | null>{
        return await this.prisma.users.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone ?? "",
            }
        })
    }
}