import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../../repository/auth.repository";
import { LoginRequestDto } from "../../dto/login-request.dto";

import argon2 from "argon2";
import { LoginResponseDto } from "../../dto/login-response.dto";
import { GenerateTokenUtils } from "../../utils/generate-token-utils";



@Injectable()
export class LoginUsecase {
    constructor(
        private repo: AuthRepository,
        private generateTokenUtils: GenerateTokenUtils
    ) { }

    async execute(request: LoginRequestDto) {
        if (!request.email || !request.password) 
            throw new UnauthorizedException('Preencha todos os campos');

        var user = await this.repo.findUserByEmail(request.email)

        if (!user) 
            throw new UnauthorizedException('Usuário não encontrado');

        const IsPasswordValid = await argon2.verify(user.password, request.password);

        if (IsPasswordValid == true) {
            const result: LoginResponseDto = this.generateTokenUtils.generateAuthAndRefreshTokenForUser(user);
            const refreshTokenHash: string = await this.generateTokenUtils.generateRefreshTokenHash(result.refresh_token)
            try{
                this.repo.saveRefreshToken(user.id, refreshTokenHash)
            }catch(e){
                throw new InternalServerErrorException('Internal Server error')
            }
            return result;
        }
        else{
            throw new UnauthorizedException('Credencias Inválidas');
        }
    }

}