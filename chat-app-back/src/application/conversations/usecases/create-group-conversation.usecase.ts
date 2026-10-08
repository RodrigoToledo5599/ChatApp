import { BadRequestException, Injectable } from '@nestjs/common';
import { ConversationsRepository } from '../repository/conversations.repository';

export interface CreateGroupConversationInputDto {
  title: string;
  memberIds: string[];
}

@Injectable()
export class CreateGroupConversationUsecase {
  constructor(private readonly conversationsRepo: ConversationsRepository) {}

  async execute(userId: string, data: CreateGroupConversationInputDto) {
    const title = data.title?.trim();
    const memberIds = Array.from(
      new Set((data.memberIds ?? []).filter((id) => !!id && id !== userId)),
    );

    if (!title || title.length < 2) {
      throw new BadRequestException('O nome do grupo deve ter pelo menos 2 caracteres.');
    }

    if (memberIds.length === 0) {
      throw new BadRequestException('Selecione pelo menos um amigo para o grupo.');
    }

    return this.conversationsRepo.createGroupConversation(userId, title, memberIds);
  }
}
