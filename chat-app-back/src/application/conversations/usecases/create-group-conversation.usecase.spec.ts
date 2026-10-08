import { CreateGroupConversationUsecase } from './create-group-conversation.usecase';

describe('CreateGroupConversationUsecase', () => {
  it('should create a group conversation with the creator and chosen members', async () => {
    const repo = {
      createGroupConversation: jest.fn().mockResolvedValue({ id: 'conversation-1' }),
    };

    const usecase = new CreateGroupConversationUsecase(repo as any);

    const result = await usecase.execute('user-1', {
      title: 'Grupo do Truco',
      memberIds: ['user-2', 'user-3'],
    });

    expect(repo.createGroupConversation).toHaveBeenCalledWith('user-1', 'Grupo do Truco', ['user-2', 'user-3']);
    expect(result).toEqual({ id: 'conversation-1' });
  });
});
