import { Module } from '@nestjs/common';
import { LoginUsecase } from './usecases/login/login.usecase';
import { AuthController } from './http/auth.controller';
import { TokenRefreshUseCase } from './usecases/token-refresh/token-refresh.usecase';
import { LogoutUsecase } from './usecases/logout/logout.usecase';
import { AuthRepository } from './repository/auth.repository';
import { GenerateTokenUtils } from './utils/generate-token-utils';


@Module({
    controllers: [AuthController],
    providers: [
        LoginUsecase,
        TokenRefreshUseCase,
        LogoutUsecase,
        GenerateTokenUtils,
        AuthRepository
    ]
})
export class AuthModule { }
