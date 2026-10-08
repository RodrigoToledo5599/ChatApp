import { Injectable } from '@nestjs/common';
import { Sessions, Users } from '@prisma/client';
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

    async createSession(id: string, userId: string, refreshHash: string, expiresAt: Date): Promise<Sessions> {
        return await this.prisma.sessions.create({
            data: { id, userId, refreshHash, expiresAt }
        })
    }

    async findSession(id: string): Promise<Sessions | null> {
        return await this.prisma.sessions.findUnique({
            where: { id }
        })
    }

    async updateSessionRefreshHash(id: string, refreshHash: string, expiresAt: Date) {
        await this.prisma.sessions.update({
            where: { id },
            data: { refreshHash, expiresAt }
        })
    }

    async deleteSession(id: string) {
        await this.prisma.sessions.deleteMany({
            where: { id }
        })
    }

}
