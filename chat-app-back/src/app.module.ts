import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpThrottlerGuard } from './middleware/guards/http-throttler.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './application/auth/auth.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { MongoModule } from './infra/mongo/mongo.module';
import { FriendsModule } from './application/friends/friends.module';
import { ConversationsModule } from './application/conversations/conversations.module';
import { UsersModule } from './application/users/users.module';
import { WebsocketModule } from './infra/websocket/websocket.module';
import { StorageModule } from './infra/storage/storage.module';
import { AttachmentsModule } from './application/attachments/attachments.module';

@Module({
  imports: [
    MongoModule,
    PrismaModule,
    StorageModule,
    MiddlewareModule,
    AuthModule,
    UsersModule,
    FriendsModule,
    ConversationsModule,
    AttachmentsModule,
    WebsocketModule,
    // jobs agendados (limpeza de anexos abandonados)
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      global: true,
      signOptions: { expiresIn: '15m', algorithm: 'HS256' },
    }),
    // limite padrão por IP; rotas sensíveis (login, cadastro, busca) têm limites próprios via @Throttle
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 120 }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: HttpThrottlerGuard },
  ],
})
export class AppModule {}
