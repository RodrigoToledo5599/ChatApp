import { Global, Module } from '@nestjs/common'
import { WebSocketMessageService } from './websocket-message.service'
import { SocketController } from './socket.controller'

@Global()
@Module({
  controllers: [SocketController],
  providers: [WebSocketMessageService],
  exports: [WebSocketMessageService]
})
export class WebsocketModule {}
