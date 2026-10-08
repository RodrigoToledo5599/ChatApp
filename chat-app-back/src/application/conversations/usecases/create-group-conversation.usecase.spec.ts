import { ForbiddenException } from '@nestjs/common';
import { CreateGroupConversationUsecase } from './create-group-conversation.usecase';

describe('CreateGroupConversationUsecase', () => {
  const ws = { notifyUsers: jest.fn() };

  it('should create a group conversation with the creator and chosen members', async () => {
    const repo = {
      findAcceptedFriendIds: jest.fn().mockResolvedValue(['user-2', 'user-3']),
      createGroupConversation: jest.fn().mockResolvedValue({ id: 'conversation-1' }),
    };

    const usecase = new CreateGroupConversationUsecase(repo as any, ws as any);

    const result = await usecase.execute('user-1', {
      title: 'Grupo do Truco',
      memberIds: ['user-2', 'user-3'],
    });

    expect(repo.findAcceptedFriendIds).toHaveBeenCalledWith('user-1', ['user-2', 'user-3']);
    expect(repo.createGroupConversation).toHaveBeenCalledWith('user-1', 'Grupo do Truco', ['user-2', 'user-3']);
    expect(result).toEqual({ id: 'conversation-1' });
    expect(ws.notifyUsers).toHaveBeenCalledWith(['user-1', 'user-2', 'user-3'], 'conversations_updated');
  });

  it('should reject members that are not accepted friends of the creator', async () => {
    const repo = {
      findAcceptedFriendIds: jest.fn().mockResolvedValue(['user-2']),
      createGroupConversation: jest.fn(),
    };

    const usecase = new CreateGroupConversationUsecase(repo as any, ws as any);

    await expect(
      usecase.execute('user-1', { title: 'Grupo do Truco', memberIds: ['user-2', 'stranger'] }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.createGroupConversation).not.toHaveBeenCalled();
  });
});
