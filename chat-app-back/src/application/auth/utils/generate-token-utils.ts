import { JwtService } from "@nestjs/jwt";
import { Users } from "@prisma/client-db-postgres";
import { LoginResponseDto } from "../../../application/auth/dto/login-response.dto";
import { UserAuthReturnDto } from "./../../../application/auth/dto/user-auth-return.dto";
import argon2 from "argon2";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GenerateTokenUtils{

    constructor(
        private jwtServ: JwtService
    ){}

    generateAuthAndRefreshTokenForUser(user: Users): LoginResponseDto{
        const userDto = new UserAuthReturnDto(user);
        const accessToken = this.jwtServ.sign({...userDto},{
            secret: process.env.SECRET_KEY_JWT,
            expiresIn: '15m'
        })
        const refreshToken = this.jwtServ.sign({...userDto},{
            secret: process.env.SECRET_KEY_REFRESH_JWT,
            expiresIn: '7d'
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