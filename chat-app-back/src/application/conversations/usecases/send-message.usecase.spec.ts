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
  let confirmAttachment: { execute: jest.Mock };
  const storage = { createDownloadUrl: jest.fn().mockResolvedValue('https://signed/url') };

  beforeEach(() => {
    confirmAttachment = {
      execute: jest.fn().mockResolvedValue({
        id: 'att-1', key: 'conversations/conv-1/att-1', mimeType: 'image/jpeg', size: 100, width: 10, height: 20,
      }),
    };
  });

  it('bloqueia o envio em conversa direta com amizade bloqueada', async () => {
    const repo = buildRepo(false, FriendshipStatus.BLOCKED);
    const usecase = new SendMessageUsecase(repo as any, { emitNewMessage: jest.fn() } as any, confirmAttachment as any, storage as any);

    await expect(usecase.execute('user-a', 'A', params)).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.createMessage).not.toHaveBeenCalled();
  });

  it('envia em grupos independentemente de bloqueios', async () => {
    const repo = buildRepo(true, FriendshipStatus.BLOCKED);
    const usecase = new SendMessageUsecase(repo as any, { emitNewMessage: jest.fn() } as any, confirmAttachment as any, storage as any);

    await expect(usecase.execute('user-a', 'A', params)).resolves.toMatchObject({ content: 'oi' });
  });

  it('não falha para quem enviou se o socket falhar depois de salvar', async () => {
    const repo = buildRepo(false, FriendshipStatus.ACCEPTED);
    const ws = { emitNewMessage: jest.fn().mockRejectedValue(new Error('redis caiu')) };
    const usecase = new SendMessageUsecase(repo as any, ws as any, confirmAttachment as any, storage as any);

    await expect(usecase.execute('user-a', 'A', params)).resolves.toMatchObject({ _id: 'msg-1' });
  });

  it('não consome o anexo se o envio for bloqueado', async () => {
    const repo = buildRepo(false, FriendshipStatus.BLOCKED);
    const usecase = new SendMessageUsecase(repo as any, { emitNewMessage: jest.fn() } as any, confirmAttachment as any, storage as any);

    await expect(usecase.execute('user-a', 'A', new MessageDtoRequest('conv-1', '', 'att-1'))).rejects.toBeInstanceOf(ForbiddenException);
    expect(confirmAttachment.execute).not.toHaveBeenCalled();
  });

  it('salva a key no Mongo mas devolve e emite só a url assinada', async () => {
    const repo = buildRepo(true, null);
    const ws = { emitNewMessage: jest.fn() };
    const usecase = new SendMessageUsecase(repo as any, ws as any, confirmAttachment as any, storage as any);

    const result = await usecase.execute('user-a', 'A', new MessageDtoRequest('conv-1', undefined as any, 'att-1'));

    expect(repo.createMessage.mock.calls[0][0]).toMatchObject({ content: '', attachment: { key: 'conversations/conv-1/att-1' } });
    expect(result.attachment).toEqual({ id: 'att-1', mimeType: 'image/jpeg', size: 100, width: 10, height: 20, url: 'https://signed/url' });
    expect(ws.emitNewMessage).toHaveBeenCalledWith('conv-1', result);
  });
});
