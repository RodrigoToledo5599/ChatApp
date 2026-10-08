import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConversationsRepository } from '../repository/conversations.repository';
import { CreateGroupConversationInputDto } from '../dto/create-group-conversation.dto';
import { WebSocketMessageService } from '../../../infra/websocket/websocket-message.service';

@Injectable()
export class CreateGroupConversationUsecase {
  constructor(
    private readonly conversationsRepo: ConversationsRepository,
    private readonly wsService: WebSocketMessageService,
  ) {}

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

    const acceptedFriendIds = new Set(
      await this.conversationsRepo.findAcceptedFriendIds(userId, memberIds),
    );
    if (memberIds.some((id) => !acceptedFriendIds.has(id))) {
      throw new ForbiddenException('Todos os membros do grupo precisam ser seus amigos.');
    }

    const conversation = await this.conversationsRepo.createGroupConversation(userId, title, memberIds);
    this.wsService.notifyUsers([userId, ...memberIds], 'conversations_updated');
    return conversation;
  }
}
