import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { AuthRepository } from "../../repository/auth.repository";
import { LoginResponseDto } from "../../dto/login-response.dto";
import { GenerateTokenUtils, REFRESH_TOKEN_TTL_MS } from "../../utils/generate-token-utils";
import { GoogleStrategy } from "../../../../middleware/strategies/google.strategy";



@Injectable()
export class GoogleLoginUsecase {
    constructor(
        private repo: AuthRepository,
        private googleStrategy: GoogleStrategy,
        private generateTokenUtils: GenerateTokenUtils
    ) { }

    async execute(credential: string): Promise<LoginResponseDto> {
        const profile = await this.googleStrategy.validateIdToken(credential);

        let user = await this.repo.findUserByGoogleId(profile.googleId);

        if (!user) {
            // o Google garante que o e-mail é verificado, então dá para vincular a uma conta existente com o mesmo e-mail
            const existing = await this.repo.findUserByEmail(profile.email);
            if (existing) {
                user = await this.repo.linkGoogleAccount(existing.id, profile.googleId);
            } else {
                try {
                    user = await this.repo.createGoogleUser(profile.name, profile.email, profile.googleId);
                } catch (error) {
                    // duas requisições simultâneas do mesmo usuário: a outra já criou a conta
                    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
                        user = await this.repo.findUserByGoogleId(profile.googleId);
                    if (!user) throw error;
                }
            }
        }

        const sessionId = randomUUID();
        const result = this.generateTokenUtils.generateAuthAndRefreshTokenForUser(user, sessionId);
        const refreshTokenHash = await this.generateTokenUtils.generateRefreshTokenHash(result.refresh_token)

        await this.repo.createSession(
            sessionId,
            user.id,
            refreshTokenHash,
            new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
        )
        return result;
    }

}
