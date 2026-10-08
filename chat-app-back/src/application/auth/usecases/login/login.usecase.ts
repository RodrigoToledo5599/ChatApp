import { Injectable, UnauthorizedException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AuthRepository } from "../../repository/auth.repository";
import { LoginRequestDto } from "../../dto/login-request.dto";

import argon2 from "argon2";
import { LoginResponseDto } from "../../dto/login-response.dto";
import { GenerateTokenUtils, REFRESH_TOKEN_TTL_MS } from "../../utils/generate-token-utils";



@Injectable()
export class LoginUsecase {
    constructor(
        private repo: AuthRepository,
        private generateTokenUtils: GenerateTokenUtils
    ) { }

    async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
        const user = await this.repo.findUserByEmail(request.email)

        // mesma mensagem para usuário inexistente e senha errada, para não revelar quais e-mails existem
        const isPasswordValid = user ? await argon2.verify(user.password, request.password) : false;
        if (!user || !isPasswordValid)
            throw new UnauthorizedException('E-mail ou senha inválidos');

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
