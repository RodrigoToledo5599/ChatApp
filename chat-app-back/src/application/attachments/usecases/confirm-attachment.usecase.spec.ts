import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AttachmentStatus } from '@prisma/client';
import { ConfirmAttachmentUsecase } from './confirm-attachment.usecase';

const JPEG_HEADER = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
const HTML_HEADER = new TextEncoder().encode('<html><script');

describe('ConfirmAttachmentUsecase', () => {
  const attachment = {
    id: 'att-1',
    key: 'conversations/conv-1/att-1',
    uploaderId: 'user-a',
    conversationId: 'conv-1',
    mimeType: 'image/jpeg',
    size: 100,
    width: 10,
    height: 20,
    status: AttachmentStatus.PENDING,
  };

  const build = (overrides: { found?: any; stored?: any; bytes?: Uint8Array; markAsReady?: boolean } = {}) => {
    const repo = {
      findById: jest.fn().mockResolvedValue('found' in overrides ? overrides.found : attachment),
      markAsReady: jest.fn().mockResolvedValue(overrides.markAsReady ?? true),
      deleteById: jest.fn(),
    };
    const storage = {
      getObjectInfo: jest.fn().mockResolvedValue('stored' in overrides ? overrides.stored : { size: 100 }),
      readFirstBytes: jest.fn().mockResolvedValue(overrides.bytes ?? JPEG_HEADER),
      delete: jest.fn(),
    };
    return { repo, storage, usecase: new ConfirmAttachmentUsecase(repo as any, storage as any) };
  };

  it('confirma um upload válido', async () => {
    const { usecase, repo } = build();

    await expect(usecase.execute('user-a', 'conv-1', 'att-1')).resolves.toMatchObject({ status: AttachmentStatus.READY });
    expect(repo.markAsReady).toHaveBeenCalledWith('att-1');
  });

  it('recusa anexo de outro usuário ou de outra conversa', async () => {
    await expect(build().usecase.execute('user-b', 'conv-1', 'att-1')).rejects.toBeInstanceOf(ForbiddenException);
    await expect(build().usecase.execute('user-a', 'conv-2', 'att-1')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('recusa quando o upload não chegou ao bucket', async () => {
    const { usecase } = build({ stored: null });

    await expect(usecase.execute('user-a', 'conv-1', 'att-1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('apaga o arquivo quando o conteúdo não é a imagem declarada', async () => {
    const { usecase, storage, repo } = build({ bytes: HTML_HEADER });

    await expect(usecase.execute('user-a', 'conv-1', 'att-1')).rejects.toBeInstanceOf(BadRequestException);
    expect(storage.delete).toHaveBeenCalledWith(attachment.key);
    expect(repo.deleteById).toHaveBeenCalledWith('att-1');
    expect(repo.markAsReady).not.toHaveBeenCalled();
  });

  it('não deixa usar o mesmo anexo em duas mensagens', async () => {
    const { usecase } = build({ markAsReady: false });

    await expect(usecase.execute('user-a', 'conv-1', 'att-1')).rejects.toBeInstanceOf(BadRequestException);
  });
});
