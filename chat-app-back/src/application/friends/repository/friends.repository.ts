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

    // amizades/pedidos do usuário; bloqueios só aparecem para quem bloqueou (ou para ambos, nos bloqueios antigos sem autor)
    async listFriends(userId: string): Promise<FriendshipWithUsers[]> {
        return await this.prisma.friendship.findMany({
            where: {
                AND: [
                    { OR: [{ senderId: userId }, { receiverId: userId }] },
                    {
                        OR: [
                            { status: { not: FriendshipStatus.BLOCKED } },
                            { blockedById: userId },
                            { blockedById: null },
                        ]
                    }
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

    async userExists(userId: string): Promise<boolean> {
        const user = await this.prisma.users.findUnique({ where: { id: userId }, select: { id: true } })
        return !!user
    }

    async addFriend(senderId: string, receiverId: string ): Promise<Friendship>{
        return await this.prisma.friendship.create({
            data:{
                senderId: senderId,
                receiverId: receiverId,
                status: FriendshipStatus.PENDING
            }
        })
    }

    async findFriendShipRequest(friendShipRequestId:string){
        return await this.prisma.friendship.findUnique({
            where:{
                id: friendShipRequestId
            }
        })
    }

    async deleteFriendShip(friendShipRequestId:string){
        return await this.prisma.friendship.delete({
            where:{
                id: friendShipRequestId
            }
        })
    }

    async acceptFriendShipRequest(friendShipRequesId:string){
        return await this.prisma.friendship.update({
            where: { id: friendShipRequesId },
            data: {status: FriendshipStatus.ACCEPTED }
        })
    }

    async blockFriend(friendShipRequesId:string, blockedById: string){
        return await this.prisma.friendship.update({
            where: { id: friendShipRequesId },
            data: {status: FriendshipStatus.BLOCKED, blockedById }
        })
    }
}
