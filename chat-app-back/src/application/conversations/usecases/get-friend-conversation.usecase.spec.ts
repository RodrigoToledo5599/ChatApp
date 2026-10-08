import { ForbiddenException } from '@nestjs/common';
import { FriendshipStatus } from '@prisma/client';
import { GetFriendConversationUsecase } from './get-friend-conversation.usecase';

describe('GetFriendConversationUsecase', () => {
  const ws = { notifyUsers: jest.fn() };

  it.each([null, FriendshipStatus.PENDING, FriendshipStatus.BLOCKED])(
    'não abre conversa sem amizade aceita (%s)',
    async (status) => {
      const repo = {
        findFriendshipBetween: jest.fn().mockResolvedValue(status ? { status } : null),
        findDirectConversation: jest.fn(),
        createConversationBetween2Users: jest.fn(),
      };
      const usecase = new GetFriendConversationUsecase(repo as any, ws as any);

      await expect(usecase.execute('user-b', 'user-a')).rejects.toBeInstanceOf(ForbiddenException);
      expect(repo.createConversationBetween2Users).not.toHaveBeenCalled();
    },
  );

  it('cria a conversa com a chave ordenada dos dois usuários', async () => {
    const repo = {
      findFriendshipBetween: jest.fn().mockResolvedValue({ status: FriendshipStatus.ACCEPTED }),
      findDirectConversation: jest.fn().mockResolvedValue(null),
      createConversationBetween2Users: jest.fn().mockResolvedValue({ id: 'conv-1' }),
    };
    const usecase = new GetFriendConversationUsecase(repo as any, ws as any);

    const result = await usecase.execute('user-b', 'user-a');

    expect(repo.createConversationBetween2Users).toHaveBeenCalledWith('user-b', 'user-a', 'user-a:user-b');
    expect(result).toEqual({ id: 'conv-1' });
  });
});
