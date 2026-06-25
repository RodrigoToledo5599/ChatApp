import { Global, Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthGuard } from './guards/auth.guard';
import { RefreshGuard } from './guards/refresh.guard';

@Global()
@Module({
  providers: [JwtStrategy, AuthGuard, RefreshGuard],
  exports: [JwtStrategy, AuthGuard, RefreshGuard],
})
export class MiddlewareModule { }
