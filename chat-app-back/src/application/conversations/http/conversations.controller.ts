import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../middleware/guards/auth.guard';
import { User } from '../../../middleware/decorators/user.decorator';
import { GetUserConversationsUsecase } from '../usecases/get-user-conversations.usecase';
import { ConversationDto } from '../dto/conversation.dto';
import { GetConversationMessagesUsecase } from '../usecases/get-conversation-messages.usecase';
import { ConversationMessagesRequestDto, ConversationMessagesResponseDto, MessageDto, MessageDtoRequest } from '../dto/conversation-messages';
import { SendMessageUsecase } from '../usecases/send-message.usecase';
import { GetFriendConversationUsecase } from '../usecases/get-friend-conversation.usecase';
import { ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { CreateGroupConversationUsecase } from '../usecases/create-group-conversation.usecase';
import { CreateGroupConversationInputDto } from '../dto/create-group-conversation.dto';


@UseGuards(AuthGuard)
@Controller('conversations')
export class ConversationsController {
    
    constructor(
        private getUserConversationsUsecase: GetUserConversationsUsecase,
        private getConversationsMessagesUsecase: GetConversationMessagesUsecase,
        private sendMessageUsecase: SendMessageUsecase,
        private getFriendConversationUsecase: GetFriendConversationUsecase,
        private createGroupConversationUsecase: CreateGroupConversationUsecase
    ){}

    @ApiOkResponse({type: [ConversationDto]})
    @Get('')
    async getUserConversations(
        @User() user
    ): Promise<ConversationDto[]>{
        return await this.getUserConversationsUsecase.execute(user.id)
    }


    @ApiOkResponse({type: ConversationMessagesResponseDto})
    @Get('messages')
    async getConversationMessages(
        @User() user,
        @Query() params :ConversationMessagesRequestDto
    ):Promise<ConversationMessagesResponseDto>{
        return await this.getConversationsMessagesUsecase.execute(user.id, params);
    }

    @ApiOkResponse({type: MessageDto})
    @ApiBody({type: MessageDtoRequest})
    @Post('messages')
    async sendMessage(
        @User() user,
        @Body() body : MessageDtoRequest
    ): Promise<MessageDto>{
        return await this.sendMessageUsecase.execute(user.id, user.name, body)

    }

    @ApiOkResponse({type: ConversationDto})
    @ApiParam({name: 'friendId', type: String})
    @Get('friend-conversation/:friendId')
    async getFriendConversation(
        @User() user,
        @Param('friendId', ParseUUIDPipe) friendId: string
    ){
        return await this.getFriendConversationUsecase.execute(user.id, friendId)
    }

    @ApiOkResponse({type: ConversationDto})
    @ApiBody({type: CreateGroupConversationInputDto})
    @Post('group')
    async createGroupConversation(
        @User() user,
        @Body() body: CreateGroupConversationInputDto
    ) {
        return await this.createGroupConversationUsecase.execute(user.id, body)
    }

}
