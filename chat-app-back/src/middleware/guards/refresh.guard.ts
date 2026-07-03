import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request} from 'express';
import { JwtStrategy } from '../strategies/jwt.strategy';


@Injectable()
export class RefreshGuard implements CanActivate {

    constructor(
        private jwtStrategy: JwtStrategy
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token: string | null = request.cookies.refreshToken;
        
        if(!token)
            throw new UnauthorizedException('Invalid or expired token');
        
        request['refresh'] = token
        
        const payload = await this.jwtStrategy.validateRefreshToken(token);
        
        request['user'] = payload;
        return true;
        
    }


}