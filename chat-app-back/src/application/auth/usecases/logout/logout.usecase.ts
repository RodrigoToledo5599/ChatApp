import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../repository/auth.repository";
import { JwtStrategy } from "../../../../middleware/strategies/jwt.strategy";



@Injectable()
export class LogoutUsecase {
    constructor(
        private repo: AuthRepository,
        private jwtStrategy: JwtStrategy
    ) { }

    // best-effort: encerra a sessão do refresh token se ele for válido; os cookies são limpos pelo controller de qualquer forma
    async execute(refreshToken?: string): Promise<void> {
        if (!refreshToken)
            return;
        try {
            const payload = await this.jwtStrategy.validateRefreshToken(refreshToken);
            if (payload?.sid)
                await this.repo.deleteSession(payload.sid);
        } catch {
            // token inválido/expirado: não há sessão para encerrar
        }
    }

}
