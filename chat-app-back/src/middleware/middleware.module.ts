import { Global, Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthGuard } from './guards/auth.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { AdminGuard } from './guards/admin.guard';

@Global()
@Module({
  providers: [JwtStrategy, AuthGuard, RefreshGuard, AdminGuard],
  exports: [JwtStrategy, AuthGuard, RefreshGuard, AdminGuard],
})
export class MiddlewareModule { }
