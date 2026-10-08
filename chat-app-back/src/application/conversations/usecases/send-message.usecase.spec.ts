import { ForbiddenException } from '@nestjs/common';
import { FriendshipStatus } from '@prisma/client';
import { SendMessageUsecase } from './send-message.usecase';
import { MessageDtoRequest } from '../dto/conversation-messages';

describe('SendMessageUsecase', () => {
  const buildRepo = (isGroup: boolean, friendshipStatus: FriendshipStatus | null) => ({
    checkIfUserIsAllowedOnConversation: jest.fn().mockResolvedValue({ userId: 'user-a' }),
    getConversationMembers: jest.fn().mockResolvedValue({
      isGroup,
      users: [{ userId: 'user-a' }, { userId: 'user-b' }],
    }),
    findFriendshipBetween: jest.fn().mockResolvedValue(friendshipStatus ? { status: friendshipStatus } : null),
    createMessage: jest.fn().mockImplementation(async (m) => ({ ...m, _id: 'msg-1' })),
  });
  const params = new MessageDtoRequest('conv-1', 'oi');

  it('bloqueia o envio em conversa direta com amizade bloqueada', async () => {
    const repo = buildRepo(false, FriendshipStatus.BLOCKED);
    const usecase = new SendMessageUsecase(repo as any, { emitNewMessage: jest.fn() } as any);

    await expect(usecase.execute('user-a', 'A', params)).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.createMessage).not.toHaveBeenCalled();
  });

  it('envia em grupos independentemente de bloqueios', async () => {
    const repo = buildRepo(true, FriendshipStatus.BLOCKED);
    const usecase = new SendMessageUsecase(repo as any, { emitNewMessage: jest.fn() } as any);

    await expect(usecase.execute('user-a', 'A', params)).resolves.toMatchObject({ content: 'oi' });
  });

  it('não falha para quem enviou se o socket falhar depois de salvar', async () => {
    const repo = buildRepo(false, FriendshipStatus.ACCEPTED);
    const ws = { emitNewMessage: jest.fn().mockRejectedValue(new Error('redis caiu')) };
    const usecase = new SendMessageUsecase(repo as any, ws as any);

    await expect(usecase.execute('user-a', 'A', params)).resolves.toMatchObject({ _id: 'msg-1' });
  });
});
