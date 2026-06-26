import { Body, Controller, Post, Res, Req, UseGuards, Get, UnauthorizedException } from '@nestjs/common';
import express from 'express';
import { LoginRequestDto } from './../dto/login-request.dto';
import { LoginUsecase } from './../usecases/login/login.usecase';
import { TokenRefreshUseCase } from '../usecases/token-refresh/token-refresh.usecase';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RefreshGuard } from '../../../middleware/guards/refresh.guard';
import { AuthGuard } from '../../../middleware/guards/auth.guard';
import { User } from '../../../middleware/decorators/user.decorator';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly loginUseCase: LoginUsecase,
        private readonly tokenRefreshUseCase: TokenRefreshUseCase
    ) { }

    @ApiOkResponse({type: LoginResponseDto})
    @ApiBody({type: LoginRequestDto})
    @Post('login')
    async login(
        @Body() params: LoginRequestDto, @Res({ passthrough: true }) res: express.Response) :Promise<LoginResponseDto> {

        var loginResponse = await this.loginUseCase.execute(params);

        if (loginResponse) {
            res.cookie('accessToken', loginResponse!.access_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 900000  // 15 minutos
                // maxAge: 5000 // 5 segundos
            });
            res.cookie('refreshToken', loginResponse!.refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/auth/refresh-token',
                maxAge: 3600000 * 24 * 15 // 15 dias
                // maxAge: 5000 // 5 segundos
            });
            return loginResponse;
        }
        return loginResponse;
    }

    @UseGuards(RefreshGuard)
    @ApiOkResponse({type: RefreshTokenDto})
    @Post('refresh-token')
    async refreshToken(@Req() request: express.Request, @Res({ passthrough: true }) res: express.Response) : Promise<RefreshTokenDto> {
        const refreshToken = request.headers.cookie?.split('=')[1]
        if(!refreshToken)
            throw new UnauthorizedException('Credencias Inválidas');
        
        var result = await this.tokenRefreshUseCase.execute(refreshToken)
        if(result){
            res.cookie('accessToken', result.access_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 900000  // 15 minutos
                // maxAge: 5000 // 5 segundos
            });
            res.cookie('refreshToken', result.refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/auth/refresh-token',
                maxAge: 3600000 * 24 * 15
            });
        }
        return result
    }

    @Get('me')
    @UseGuards(AuthGuard)
    getProfile(
        @User() user) {
        return user; 
    }

}
