import { JwtService } from "@nestjs/jwt";
import { Users } from "@prisma/client";
import { LoginResponseDto } from "../../../application/auth/dto/login-response.dto";
import { UserAuthReturnDto } from "./../../../application/auth/dto/user-auth-return.dto";
import argon2 from "argon2";
import { Injectable } from "@nestjs/common";

export const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutos
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

@Injectable()
export class GenerateTokenUtils{

    constructor(
        private jwtServ: JwtService
    ){}

    generateAuthAndRefreshTokenForUser(user: Users, sessionId: string): LoginResponseDto{
        const userDto = new UserAuthReturnDto(user);
        const accessToken = this.jwtServ.sign({...userDto},{
            secret: process.env.SECRET_KEY_JWT,
            expiresIn: ACCESS_TOKEN_TTL_MS / 1000
        })

        const refreshPayload = {
            "id": userDto.id,
            "sid": sessionId
        };

        const refreshToken = this.jwtServ.sign({...refreshPayload},{
            secret: process.env.SECRET_KEY_REFRESH_JWT,
            expiresIn: REFRESH_TOKEN_TTL_MS / 1000
        })
        const result = new LoginResponseDto(
            userDto,
            accessToken,
            refreshToken
        );
        return result;
    }

    async generateRefreshTokenHash(refreshToken :string): Promise<string>{
        const refreshTokenHash = await argon2.hash(refreshToken, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 2,
        });
        return refreshTokenHash;
    }


}
