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
        // const token: string | null = request.cookies.refreshToken;

        const tokenRaw: string | undefined = request.headers.cookie
        const token: string | undefined = tokenRaw?.split('=')[1]

        if(!token)
            throw new UnauthorizedException('Invalid or expired token');
        
        
        const payload = await this.jwtStrategy.validateToken(token);
        
        request['user'] = payload;
        return true;
        
    }


}