import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request} from 'express';
import { JwtStrategy } from '../strategies/jwt.strategy';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private jwtStrategy: JwtStrategy
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        if(!request.cookies.accessToken)
            throw new UnauthorizedException('Invalid or expired token');

        const token: string | undefined = request.cookies.accessToken;

        if(!token)
            throw new UnauthorizedException('Invalid or expired token');

        const payload = await this.jwtStrategy.validateToken(token);
        
        request['user'] = payload;
        return true;
        
    }


}