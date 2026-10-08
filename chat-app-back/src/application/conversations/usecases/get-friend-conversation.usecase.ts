import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { FriendshipStatus, Prisma } from "@prisma/client";
import { ConversationsRepository } from "../repository/conversations.repository";
import { WebSocketMessageService } from "../../../infra/websocket/websocket-message.service";


export const buildDirectKey = (userId: string, otherUserId: string) => [userId, otherUserId].sort().join(':')


@Injectable()
export class GetFriendConversationUsecase{

    constructor(
        private  conversationsRepo: ConversationsRepository,
        private wsService: WebSocketMessageService
    ) {}


    async execute(userid: string, friendId: string){
        if(!friendId || userid === friendId)
            throw new BadRequestException("Usuário inválido para iniciar uma conversa")

        const friendship = await this.conversationsRepo.findFriendshipBetween(userid, friendId)
        if(!friendship || friendship.status !== FriendshipStatus.ACCEPTED)
            throw new ForbiddenException("Você só pode conversar com amigos")

        const directKey = buildDirectKey(userid, friendId)
        const existing = await this.conversationsRepo.findDirectConversation(directKey)
        if(existing)
            return existing

        try{
            const created = await this.conversationsRepo.createConversationBetween2Users(userid, friendId, directKey)
            this.wsService.notifyUsers([userid, friendId], 'conversations_updated')
            return created
        }catch(e){
            // os dois abriram a conversa ao mesmo tempo: a outra requisição já criou
            if(e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002'){
                const created = await this.conversationsRepo.findDirectConversation(directKey)
                if(created)
                    return created
            }
            throw e
        }
    }
}
