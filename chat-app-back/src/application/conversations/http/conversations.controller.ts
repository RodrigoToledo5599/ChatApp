import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../middleware/guards/auth.guard';
import { User } from '../../../middleware/decorators/user.decorator';
import { GetUserConversationsUsecase } from '../usecases/get-user-conversations.usecase';
import { ConversationDto } from '../dto/conversation.dto';
import { GetConversationMessagesUsecase } from '../usecases/get-conversation-messages.usecase';
import { ConversationMessagesRequestDto, ConversationMessagesResponseDto, MessageDto } from '../dto/conversation-messages';
import { SendMessageUsecase } from '../usecases/send-message.usecase';


@UseGuards(AuthGuard)
@Controller('conversations')
export class ConversationsController {
    
    constructor(
        private getUserConversationsUsecase: GetUserConversationsUsecase,
        private getConversationsMessagesUsecase: GetConversationMessagesUsecase,
        private sendMessageUsecase: SendMessageUsecase
    ){}

    @Get('')
    async getUserConversations(
        @User() user
    ): Promise<ConversationDto[]>{
        return await this.getUserConversationsUsecase.execute(user.id)
    }


    @Get('messages')
    async getConversationMessages(
        @User() user,
        @Query() params :ConversationMessagesRequestDto
    ):Promise<ConversationMessagesResponseDto>{
        return await this.getConversationsMessagesUsecase.execute(user.id, params);
    }

    @Post('messages')
    async sendMessage(
        @User() user,
        @Body() body : MessageDto
    ){
        return await this.sendMessageUsecase.execute(user.id, body)

    }



}
