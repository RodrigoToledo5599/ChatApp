import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import { Friendship, FriendshipStatus, Prisma } from "@prisma/client";



export type FriendshipWithUsers = Prisma.FriendshipGetPayload<{
  include: {
    sender: { select: { id: true; name: true; email: true } };
    receiver: { select: { id: true; name: true; email: true } };
  };
}>;

@Injectable()
export class FriendsRepository {
    constructor(private prisma: PrismaService){}

    async findFriendship(senderId: string, receiverId: string ): Promise<Friendship | null>{
        return await this.prisma.friendship.findFirst({
            where:{
                OR: [
                    {
                        senderId: senderId,
                        receiverId: receiverId
                    },
                    {
                        senderId: receiverId,
                        receiverId: senderId
                    },
                ]
            },
            
        })
    }

    async listFriends(userId: string): Promise<FriendshipWithUsers[] | null> {
        return await this.prisma.friendship.findMany({
            where: {
                status: FriendshipStatus.ACCEPTED,
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            include: {
                sender: {
                    select: { id: true, name: true, email: true }
                },
                receiver: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }

    async addFriend(senderId: string, receiverId: string ): Promise<Friendship | null>{
        return await this.prisma.friendship.create({
            data:{
                senderId: senderId,
                receiverId: receiverId,
                status: FriendshipStatus.PENDING
            }
        })

    }
}