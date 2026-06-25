import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    MongoModule,
    PrismaModule,
    MiddlewareModule, 
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      global: true,
      signOptions: { expiresIn: '2h', algorithm: 'HS256' },
    }),
    AuthModule,
    UsersModule,
    FriendsModule,
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
