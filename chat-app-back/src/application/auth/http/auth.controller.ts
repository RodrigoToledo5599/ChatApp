import { Body, Controller, Post, Res, Req, UseGuards, Get, HttpCode } from '@nestjs/common';
import express from 'express';
import { Throttle } from '@nestjs/throttler';
import { LoginRequestDto } from './../dto/login-request.dto';
import { LoginUsecase } from './../usecases/login/login.usecase';
import { GoogleLoginUsecase } from '../usecases/google-login/google-login.usecase';
import { GoogleLoginRequestDto } from '../dto/google-login-request.dto';
import { TokenRefreshUseCase } from '../usecases/token-refresh/token-refresh.usecase';
import { LogoutUsecase } from '../usecases/logout/logout.usecase';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AuthUserResponseDto } from '../dto/auth-user-response.dto';
import { RefreshGuard } from '../../../middleware/guards/refresh.guard';
import { AuthGuard } from '../../../middleware/guards/auth.guard';
import { User } from '../../../middleware/decorators/user.decorator';
import { ACCESS_TOKEN_TTL_MS, REFRESH_TOKEN_TTL_MS } from '../utils/generate-token-utils';


const isProduction = process.env.NODE_ENV === 'production';

const baseCookieOptions: express.CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
};

// o refresh token só é enviado para as rotas /auth (refresh e logout)
const refreshCookieOptions: express.CookieOptions = { ...baseCookieOptions, path: '/auth' };


@Controller('auth')
export class AuthController {

    constructor(
        private readonly loginUseCase: LoginUsecase,
        private readonly googleLoginUseCase: GoogleLoginUsecase,
        private readonly tokenRefreshUseCase: TokenRefreshUseCase,
        private readonly logoutUseCase: LogoutUsecase
    ) { }

    private setAuthCookies(res: express.Response, accessToken: string, refreshToken: string) {
        res.cookie('accessToken', accessToken, { ...baseCookieOptions, maxAge: ACCESS_TOKEN_TTL_MS });
        res.cookie('refreshToken', refreshToken, { ...refreshCookieOptions, maxAge: REFRESH_TOKEN_TTL_MS });
    }

    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    @ApiOkResponse({type: AuthUserResponseDto})
    @ApiBody({type: LoginRequestDto})
    @HttpCode(200)
    @Post('login')
    async login(
        @Body() params: LoginRequestDto, @Res({ passthrough: true }) res: express.Response) :Promise<AuthUserResponseDto> {

        const loginResponse = await this.loginUseCase.execute(params);
        this.setAuthCookies(res, loginResponse.access_token, loginResponse.refresh_token);
        return new AuthUserResponseDto(loginResponse.user);
    }

    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    @ApiOkResponse({type: AuthUserResponseDto})
    @ApiBody({type: GoogleLoginRequestDto})
    @HttpCode(200)
    @Post('google')
    async googleLogin(
        @Body() params: GoogleLoginRequestDto, @Res({ passthrough: true }) res: express.Response) :Promise<AuthUserResponseDto> {

        const loginResponse = await this.googleLoginUseCase.execute(params.credential);
        this.setAuthCookies(res, loginResponse.access_token, loginResponse.refresh_token);
        return new AuthUserResponseDto(loginResponse.user);
    }

    @UseGuards(RefreshGuard)
    @ApiOkResponse({type: AuthUserResponseDto})
    @HttpCode(200)
    @Post('refresh-token')
    async refreshToken(@Req() request: express.Request, @Res({ passthrough: true }) res: express.Response) : Promise<AuthUserResponseDto> {
        const result = await this.tokenRefreshUseCase.execute(request['refresh'], request['user'])
        this.setAuthCookies(res, result.access_token, result.refresh_token);
        return new AuthUserResponseDto(result.user)
    }

    @HttpCode(204)
    @Post('logout')
    async logout(@Req() request: express.Request, @Res({ passthrough: true }) res: express.Response): Promise<void> {
        await this.logoutUseCase.execute(request.cookies?.refreshToken);
        res.clearCookie('accessToken', baseCookieOptions);
        res.clearCookie('refreshToken', refreshCookieOptions);
        // cookie antigo, de quando o refresh usava esse path
        res.clearCookie('refreshToken', { ...baseCookieOptions, path: '/auth/refresh-token' });
    }

    @Get('me')
    @UseGuards(AuthGuard)
    getProfile(
        @User() user) {
        return { id: user.id, name: user.name, email: user.email };
    }

}
