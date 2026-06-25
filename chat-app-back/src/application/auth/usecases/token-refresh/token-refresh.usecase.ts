import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AuthRepository } from "../../repository/auth.repository";
import argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenDto } from "../../dto/refresh-token.dto";
import { GenerateTokenUtils } from "../../utils/generate-token-utils";
import { UserAuthReturnDto } from "./../../dto/user-auth-return.dto";




@Injectable()
export class TokenRefreshUseCase {
    constructor(
        private repo: AuthRepository,
        private jwtServ: JwtService,
        private gTokenUtils: GenerateTokenUtils
    ) { }

    async execute(refreshToken: string) : Promise<RefreshTokenDto>{
        try {
            const payload = this.jwtServ.verify(refreshToken, {
                secret: process.env.SECRET_KEY_REFRESH_JWT
            });

            const user = await this.repo.findUserById(payload.id);
            if (!user || !user.refresh) {
                throw new BadRequestException('Acesso negado');
            }

            const isTokenValid = await argon2.verify(user.refresh, refreshToken);
            if (!isTokenValid) {
                throw new BadRequestException('Refresh token inválido ou expirado');
            }

            const newRefreshedToken = this.gTokenUtils.generateAuthAndRefreshTokenForUser(user)
            
            const userDto = new UserAuthReturnDto(user);
            const result : RefreshTokenDto= new RefreshTokenDto(
                userDto,
                newRefreshedToken.access_token,
                newRefreshedToken.refresh_token
            );
            
            
            const newRefreshTokenHash = await this.gTokenUtils.generateRefreshTokenHash(result.refresh_token);

            try{
                this.repo.saveRefreshToken(user.id, newRefreshTokenHash)
            }catch(e){
                throw new InternalServerErrorException('Internal Server error')
            }
            return result;

        } catch (e) {
            throw new BadRequestException('Token inválido');
        }
    }

    

    

}
