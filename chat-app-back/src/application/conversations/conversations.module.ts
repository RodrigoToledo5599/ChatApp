import { Module } from '@nestjs/common';
import { ConversationsController } from './http/conversations.controller';
import { ConversationsRepository } from './repository/conversations.repository';
import { GetUserConversationsUsecase } from './usecases/get-user-conversations.usecase';
import { GetConversationMessagesUsecase } from './usecases/get-conversation-messages.usecase';
import { SendMessageUsecase } from './usecases/send-message.usecase';

@Module({
  controllers: [ConversationsController],
  providers:[
    ConversationsRepository,
    GetUserConversationsUsecase,
    GetConversationMessagesUsecase,
    SendMessageUsecase
  ]
})
export class ConversationsModule {}
