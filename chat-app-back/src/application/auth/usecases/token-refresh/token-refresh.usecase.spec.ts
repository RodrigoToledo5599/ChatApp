import { UnauthorizedException } from '@nestjs/common';
import argon2 from 'argon2';
import { TokenRefreshUseCase } from './token-refresh.usecase';

describe('TokenRefreshUseCase', () => {
  const user = { id: 'user-1', name: 'Rodrigo', email: 'rod@gmail.com' };
  let session: { id: string; userId: string; refreshHash: string; expiresAt: Date };
  let repo: Record<string, jest.Mock>;
  let usecase: TokenRefreshUseCase;

  beforeEach(async () => {
    session = {
      id: 'session-1',
      userId: user.id,
      refreshHash: await argon2.hash('current-refresh'),
      expiresAt: new Date(Date.now() + 60_000),
    };
    repo = {
      findSession: jest.fn().mockResolvedValue(session),
      findUserById: jest.fn().mockResolvedValue(user),
      updateSessionRefreshHash: jest.fn().mockResolvedValue(undefined),
      deleteSession: jest.fn().mockResolvedValue(undefined),
    };
    const tokenUtils = {
      generateAuthAndRefreshTokenForUser: jest.fn().mockReturnValue({ user, access_token: 'new-access', refresh_token: 'new-refresh' }),
      generateRefreshTokenHash: jest.fn().mockResolvedValue('new-hash'),
    };
    usecase = new TokenRefreshUseCase(repo as any, tokenUtils as any);
  });

  it('rotaciona o refresh token da sessão', async () => {
    const result = await usecase.execute('current-refresh', { id: user.id, sid: session.id });

    expect(result.refresh_token).toBe('new-refresh');
    expect(repo.updateSessionRefreshHash).toHaveBeenCalledWith(session.id, 'new-hash', expect.any(Date));
  });

  it('encerra a sessão quando um refresh token antigo é reutilizado', async () => {
    await expect(usecase.execute('old-refresh', { id: user.id, sid: session.id }))
      .rejects.toBeInstanceOf(UnauthorizedException);
    expect(repo.deleteSession).toHaveBeenCalledWith(session.id);
  });

  it('rejeita tokens sem sessão (emitidos antes das sessões existirem)', async () => {
    await expect(usecase.execute('current-refresh', { id: user.id }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejeita sessão de outro usuário', async () => {
    await expect(usecase.execute('current-refresh', { id: 'other-user', sid: session.id }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });
});
