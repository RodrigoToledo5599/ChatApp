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

    async findUsersbyName(namePart: string) : Promise<Users[] | null>{
        return await this.prisma.users.findMany({
            where:{
                name:{
                    contains: namePart,
                    mode: 'insensitive'
                }
            }
        })
    }

    async findUsersByEmail(emailPart: string) : Promise<Users[] | null>{
        return await this.prisma.users.findMany({
            where: {
                email:{
                    contains: emailPart,
                    mode: 'insensitive'
                }
            }
        })
    }
}