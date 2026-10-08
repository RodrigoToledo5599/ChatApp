import { UnauthorizedException } from '@nestjs/common';
import argon2 from 'argon2';
import { LoginUsecase } from './login.usecase';
import { LoginRequestDto } from '../../dto/login-request.dto';

describe('LoginUsecase', () => {
  const user = {
    id: 'afcc40d2-ed37-4f7e-8748-723b8adb9b54',
    name: 'Rodrigo Toledo',
    email: 'rod@gmail.com',
    phone: null,
    password: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let repo: { findUserByEmail: jest.Mock; createSession: jest.Mock };
  let tokenUtils: { generateAuthAndRefreshTokenForUser: jest.Mock; generateRefreshTokenHash: jest.Mock };
  let usecase: LoginUsecase;

  beforeAll(async () => {
    user.password = await argon2.hash('123');
  });

  beforeEach(() => {
    repo = {
      findUserByEmail: jest.fn(),
      createSession: jest.fn().mockResolvedValue({}),
    };
    tokenUtils = {
      generateAuthAndRefreshTokenForUser: jest.fn().mockReturnValue({
        user: { id: user.id, name: user.name, email: user.email },
        access_token: 'access',
        refresh_token: 'refresh',
      }),
      generateRefreshTokenHash: jest.fn().mockResolvedValue('refresh-hash'),
    };
    usecase = new LoginUsecase(repo as any, tokenUtils as any);
  });

  it('cria uma sessão e retorna os tokens quando as credenciais são válidas', async () => {
    repo.findUserByEmail.mockResolvedValue(user);

    const result = await usecase.execute(new LoginRequestDto('rod@gmail.com', '123'));

    expect(result.user).toEqual({ id: user.id, name: user.name, email: user.email });
    const sessionId = tokenUtils.generateAuthAndRefreshTokenForUser.mock.calls[0][1];
    expect(repo.createSession).toHaveBeenCalledWith(sessionId, user.id, 'refresh-hash', expect.any(Date));
  });

  it('retorna a mesma mensagem para senha errada e usuário inexistente', async () => {
    repo.findUserByEmail.mockResolvedValueOnce(user);
    const wrongPassword = usecase.execute(new LoginRequestDto('rod@gmail.com', 'errada'));
    await expect(wrongPassword).rejects.toThrow(new UnauthorizedException('E-mail ou senha inválidos'));

    repo.findUserByEmail.mockResolvedValueOnce(null);
    const unknownUser = usecase.execute(new LoginRequestDto('ninguem@gmail.com', '123'));
    await expect(unknownUser).rejects.toThrow(new UnauthorizedException('E-mail ou senha inválidos'));

    expect(repo.createSession).not.toHaveBeenCalled();
  });
});
