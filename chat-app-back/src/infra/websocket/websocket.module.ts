import { Global, Module } from '@nestjs/common'
import { WebSocketMessageService } from './websocket-message.service'

@Global()
@Module({
  providers: [WebSocketMessageService],
  exports: [WebSocketMessageService]
})
export class WebsocketModule {}
