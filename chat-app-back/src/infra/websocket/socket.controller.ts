import { Controller, Get, UseGuards } from "@nestjs/common";
import { WebSocketMessageService } from "./websocket-message.service";
import { AdminGuard } from "../../middleware/guards/admin.guard";


// apenas para monitorar o número de conexões ativas, não é necessário para o funcionamento do chat.
@UseGuards(AdminGuard)
@Controller('ws')
export class SocketController {
  constructor(private readonly webSocketMessageService: WebSocketMessageService) {}

  @Get('connections')
  async getConnectionsCount() {
    return await this.webSocketMessageService.getActiveRooms();
  }
}