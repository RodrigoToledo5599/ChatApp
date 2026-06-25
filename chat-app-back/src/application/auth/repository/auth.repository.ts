import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client-db-postgres';
import { PrismaService } from './../../../infra/prisma/prisma.service';

@Injectable()
export class AuthRepository {
    constructor(private prisma: PrismaService) { }

    async findUserByEmail(email: string): Promise<Users | null> {
        return await this.prisma.users.findFirst({
            where: { email },
        });
    }


    async findUserById(id: string): Promise<Users | null> {
        return this.prisma.users.findFirst({
            where: {
                id
            }
        })
    }

    async saveRefreshToken(id: string, hashedRefreshToken: string) {
        await this.prisma.users.update({
            where: {
                id: id
            },
            data: {
                refresh: hashedRefreshToken
            }
        })
    }

   
}