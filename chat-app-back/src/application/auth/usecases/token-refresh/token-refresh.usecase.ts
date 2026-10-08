import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../../repository/auth.repository";
import argon2 from "argon2";
import { RefreshTokenDto } from "../../dto/refresh-token.dto";
import { GenerateTokenUtils, REFRESH_TOKEN_TTL_MS } from "../../utils/generate-token-utils";
import { UserAuthReturnDto } from "./../../dto/user-auth-return.dto";




@Injectable()
export class TokenRefreshUseCase {
    constructor(
        private repo: AuthRepository,
        private gTokenUtils: GenerateTokenUtils
    ) { }

    // payload já validado pelo RefreshGuard (assinatura e expiração)
    async execute(refreshToken: string, payload: { id: string, sid?: string }) : Promise<RefreshTokenDto>{
        if (!payload?.sid)
            throw new UnauthorizedException('Sessão inválida');

        const session = await this.repo.findSession(payload.sid);
        if (!session || session.userId !== payload.id || session.expiresAt < new Date())
            throw new UnauthorizedException('Sessão inválida ou expirada');

        const isTokenValid = await argon2.verify(session.refreshHash, refreshToken);
        if (!isTokenValid) {
            // token antigo reutilizado: possível roubo, encerra a sessão
            await this.repo.deleteSession(session.id);
            throw new UnauthorizedException('Sessão inválida ou expirada');
        }

        const user = await this.repo.findUserById(session.userId);
        if (!user)
            throw new UnauthorizedException('Sessão inválida');

        const newTokens = this.gTokenUtils.generateAuthAndRefreshTokenForUser(user, session.id)
        const newRefreshTokenHash = await this.gTokenUtils.generateRefreshTokenHash(newTokens.refresh_token);

        await this.repo.updateSessionRefreshHash(
            session.id,
            newRefreshTokenHash,
            new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
        )

        return new RefreshTokenDto(
            new UserAuthReturnDto(user),
            newTokens.access_token,
            newTokens.refresh_token
        );
    }

}
