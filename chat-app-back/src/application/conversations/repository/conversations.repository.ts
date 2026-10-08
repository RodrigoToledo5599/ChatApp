import { Injectable } from '@nestjs/common';
import { MongoService } from '../../../infra/mongo/mongo.service';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { Conversations, Friendship, FriendshipStatus, UsersOnConversations } from '@prisma/client';
import { MessageDto } from '../dto/conversation-messages';
import { Filter, ObjectId } from 'mongodb';
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

  async checkIfUserIsAllowedOnConversation(userId: string, conversationId: string): Promise<UsersOnConversations | null>{
    return await this.prisma.usersOnConversations.findUnique({
      where:{
        userId_conversationId: { userId, conversationId }
      }
    })
  }

  async findFriendshipBetween(userId: string, otherUserId: string): Promise<Friendship | null> {
    return await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ]
      }
    })
  }

  async findAcceptedFriendIds(userId: string, candidateIds: string[]): Promise<string[]> {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [
          { senderId: userId, receiverId: { in: candidateIds } },
          { receiverId: userId, senderId: { in: candidateIds } },
        ]
      },
      select: { senderId: true, receiverId: true }
    })
    return friendships.map((f) => f.senderId === userId ? f.receiverId : f.senderId)
  }

  async getConversationMembers(conversationId: string) {
    return await this.prisma.conversations.findUnique({
      where: { id: conversationId },
      select: {
        isGroup: true,
        users: { select: { userId: true } }
      }
    })
  }

  // mensagens mais recentes primeiro; o cursor (createdAt + _id) aponta para a mais antiga já carregada
  async getConversationMessages(conversationId: string, limit: number, cursor?: { createdAt: Date, id: ObjectId }) {
    const query: Filter<MessageDto> = { conversationId };

    if (cursor)
      query.$or = [
        { createdAt: { $lt: cursor.createdAt } },
        { createdAt: cursor.createdAt, _id: { $lt: cursor.id } },
      ];

    return this.mongoService.db
      .collection<MessageDto>(MongoCollections.Messages)
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .toArray()
      .then(messages => messages.reverse());
  }

  async createMessage(newMessage :MessageDto): Promise<MessageDto> {
    
    const result = await this.mongoService.db
      .collection<MessageDto>(MongoCollections.Messages)
      .insertOne(newMessage);

      return {
        ...newMessage,
        _id: result.insertedId,
      };
  }

  async findDirectConversation(directKey: string) : Promise<Conversations | null>{
    return await this.prisma.conversations.findUnique({
      where: { directKey }
    });
  }

  async createConversationBetween2Users(userId: string, friendId: string, directKey: string) : Promise<Conversations>{
    return await this.prisma.conversations.create({
      data: {
        isGroup: false,
        title: null,
        directKey,
        users: {
          createMany: {
            data: [
              { userId: userId },
              { userId: friendId }
            ]
          }
        }
      }
    });
  }

  async createGroupConversation(userId: string, title: string, memberIds: string[]): Promise<Conversations> {
    const uniqueMemberIds = Array.from(new Set([userId, ...memberIds]));

    return await this.prisma.conversations.create({
      data: {
        title,
        isGroup: true,
        users: {
          createMany: {
            data: uniqueMemberIds.map((memberId) => ({ userId: memberId }))
          }
        }
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    });
  }

}