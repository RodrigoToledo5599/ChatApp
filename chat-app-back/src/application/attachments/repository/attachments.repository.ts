import { Injectable } from '@nestjs/common';
import { AttachmentStatus, Attachments, UsersOnConversations } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';

type NewAttachment = Pick<Attachments, 'id' | 'key' | 'uploaderId' | 'conversationId' | 'mimeType' | 'size' | 'width' | 'height'>

@Injectable()
export class AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async checkIfUserIsAllowedOnConversation(userId: string, conversationId: string): Promise<UsersOnConversations | null> {
    return await this.prisma.usersOnConversations.findUnique({
      where: { userId_conversationId: { userId, conversationId } }
    })
  }

  async create(data: NewAttachment): Promise<Attachments> {
    return await this.prisma.attachments.create({ data })
  }

  async findById(id: string): Promise<Attachments | null> {
    return await this.prisma.attachments.findUnique({ where: { id } })
  }

  // só um envio consegue fazer a troca PENDING -> READY; evita usar o mesmo anexo em duas mensagens
  async markAsReady(id: string): Promise<boolean> {
    const { count } = await this.prisma.attachments.updateMany({
      where: { id, status: AttachmentStatus.PENDING },
      data: { status: AttachmentStatus.READY },
    })
    return count === 1
  }

  async findPendingCreatedBefore(date: Date, take: number): Promise<Attachments[]> {
    return await this.prisma.attachments.findMany({
      where: { status: AttachmentStatus.PENDING, createdAt: { lt: date } },
      orderBy: { createdAt: 'asc' },
      take,
    })
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.attachments.deleteMany({ where: { id } })
  }
}
