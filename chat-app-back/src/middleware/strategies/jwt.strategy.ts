import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy {
  constructor(private jwtService: JwtService) {}

  async validateToken(token: string): Promise<any> {
    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('No token was provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY_JWT,
        algorithms: ['HS256']
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}