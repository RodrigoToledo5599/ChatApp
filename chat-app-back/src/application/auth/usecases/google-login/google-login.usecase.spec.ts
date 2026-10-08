import { UnauthorizedException } from '@nestjs/common';
import { GoogleLoginUsecase } from './google-login.usecase';

describe('GoogleLoginUsecase', () => {
    const profile = { googleId: 'g-123', email: 'rod@gmail.com', name: 'Rodrigo' };
    const user = { id: 'u-1', name: 'Rodrigo', email: 'rod@gmail.com' };

    let repo: any;
    let googleStrategy: any;
    let tokenUtils: any;
    let usecase: GoogleLoginUsecase;

    beforeEach(() => {
        repo = {
            findUserByGoogleId: jest.fn(),
            findUserByEmail: jest.fn(),
            linkGoogleAccount: jest.fn(),
            createGoogleUser: jest.fn(),
            createSession: jest.fn(),
        };
        googleStrategy = { validateIdToken: jest.fn().mockResolvedValue(profile) };
        tokenUtils = {
            generateAuthAndRefreshTokenForUser: jest.fn().mockReturnValue({ user, access_token: 'a', refresh_token: 'r' }),
            generateRefreshTokenHash: jest.fn().mockResolvedValue('hash'),
        };
        usecase = new GoogleLoginUsecase(repo, googleStrategy, tokenUtils);
    });

    it('entra com usuário já vinculado ao Google', async () => {
        repo.findUserByGoogleId.mockResolvedValue(user);

        await usecase.execute('token');

        expect(repo.findUserByEmail).not.toHaveBeenCalled();
        expect(repo.createSession).toHaveBeenCalledWith(expect.any(String), 'u-1', 'hash', expect.any(Date));
    });

    it('vincula o Google a uma conta existente com o mesmo e-mail', async () => {
        repo.findUserByGoogleId.mockResolvedValue(null);
        repo.findUserByEmail.mockResolvedValue(user);
        repo.linkGoogleAccount.mockResolvedValue(user);

        await usecase.execute('token');

        expect(repo.linkGoogleAccount).toHaveBeenCalledWith('u-1', 'g-123');
        expect(repo.createGoogleUser).not.toHaveBeenCalled();
    });

    it('cria uma conta nova quando o e-mail não existe', async () => {
        repo.findUserByGoogleId.mockResolvedValue(null);
        repo.findUserByEmail.mockResolvedValue(null);
        repo.createGoogleUser.mockResolvedValue(user);

        await usecase.execute('token');

        expect(repo.createGoogleUser).toHaveBeenCalledWith('Rodrigo', 'rod@gmail.com', 'g-123');
    });

    it('não cria sessão quando o token do Google é inválido', async () => {
        googleStrategy.validateIdToken.mockRejectedValue(new UnauthorizedException());

        await expect(usecase.execute('bad')).rejects.toThrow(UnauthorizedException);
        expect(repo.createSession).not.toHaveBeenCalled();
    });
});
