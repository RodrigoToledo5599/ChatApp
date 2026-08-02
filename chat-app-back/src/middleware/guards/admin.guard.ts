import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request} from 'express';
import { JwtStrategy } from '../strategies/jwt.strategy';


@Injectable()
export class AdminGuard implements CanActivate {

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const adminSecretKey = request.headers["admin-secret-key"];
        if(!adminSecretKey)
            throw new UnauthorizedException('Invalid credentials');
        if(adminSecretKey !== process.env.ADMIN_SECRET_KEY)
            throw new UnauthorizedException('Invalid credentials');
        else
            return true;
        
    }


}