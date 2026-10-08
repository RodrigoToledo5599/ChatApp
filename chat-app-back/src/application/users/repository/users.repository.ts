import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import { Users } from "@prisma/client";


@Injectable()
export class UsersRepository{
    constructor(
        private prisma: PrismaService
    ){}

    async findUserById(id:string ): Promise<Users | null>{
        return await this.prisma.users.findFirst({
            where: {id: id},
        })
    }

    async findUsersByName(namePart: string, excludeUserId: string) : Promise<Users[]>{
        return await this.prisma.users.findMany({
            where:{
                id: { not: excludeUserId },
                name:{
                    contains: namePart,
                    mode: 'insensitive'
                }
            },
            take: 5
        })
    }

    async findUsersByExactEmail(email: string, excludeUserId: string) : Promise<Users[]>{
        return await this.prisma.users.findMany({
            where: {
                id: { not: excludeUserId },
                email
            },
            take: 1
        })
    }
}
