import { Injectable } from '@nestjs/common';
import { MongoService } from '../../../infra/mongo/mongo.service';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { UsersOnConversations } from '@prisma/client';
import { ConversationMessagesRequestDto, MessageDto } from '../dto/conversation-messages';
import { MongoCollections } from '../../../infra/mongo/mongo.collections';

@Injectable()
export class ConversationsRepository {
  constructor(
    private mongoService: MongoService,
    private prisma: PrismaService
  ) {}


  async getMyConversations(userId: string) {
    const userConversations = await this.prisma.usersOnConversations.findMany({
      where: {
        userId: userId,
      },
      include: {
        conversation: {
          include: {
            users: {
              where: {
                userId: {
                  not: userId,
                },
              },
              include: {
                user: {
                  select: {
                    id:true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return userConversations
  }

  async checkIfUserIsAllowedOnConversation(userId,conversationId): Promise<UsersOnConversations | null>{
    return await this.prisma.usersOnConversations.findUnique({
      where:{
        userId_conversationId: { userId, conversationId }
      }
    })
  }

  async getConversationMessages(params: ConversationMessagesRequestDto) {
    const conversationId = params.conversationId
    const query: any = { conversationId };
    const limit = Number(params.limit) || 10

    if (params.oldestMessageDate) 
      query.createdAt = { $lt: new Date(params.oldestMessageDate) };

    return this.mongoService.db
      .collection<MessageDto>(MongoCollections.Messages)
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
      .then(messages => messages.reverse());
  }

  async createMessage(newMessage :MessageDto) {
      const result = await this.mongoService.db
        .collection<MessageDto>(MongoCollections.Messages)
        .insertOne(newMessage);

      return {
        _id: result.insertedId,
        ...newMessage,
      };
  }


}