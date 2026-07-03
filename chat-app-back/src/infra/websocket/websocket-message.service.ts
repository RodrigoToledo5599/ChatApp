import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Namespace, Socket } from 'socket.io'
import * as cookie from 'cookie'
import { JwtStrategy } from '../../middleware/strategies/jwt.strategy'

@WebSocketGateway({
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true
  },
  namespace: '/messages',
  transports: ['websocket']
})
export class WebSocketMessageService implements OnGatewayConnection {
  

  @WebSocketServer()
  public readonly namespace!: Namespace
  
  constructor(
    private readonly jwtStrategy: JwtStrategy
  ) {}

  
  afterInit(namespace: Namespace) {
    namespace.server.of('/').use((socket, next) => {
      const err = new Error('Conexão não permitida');
      (err as any).data = { content: 'Please use a valid namespace' };
      next(err);
    });

    namespace.use(async (socket: Socket, next) => {
      try {
        const cookieHeader = socket.handshake.headers.cookie;
        if (!cookieHeader) return next(new Error('Unauthorized: No cookies'));

        const parsedCookies = cookie.parse(cookieHeader);
        const token = parsedCookies.accessToken;
        if (!token) return next(new Error('Unauthorized: Token missing'));

        const payload = await this.jwtStrategy.validateToken(token);
        
        (socket as any).user = payload; 
        
        next();
      } catch (error) {
        const authError = new Error('Unauthorized');
        (authError as any).data = { content: 'Invalid or expired token' };
        next(authError);
      }
    });

    namespace.on('error', (err) => {
      console.error(`WebSocket internal error: ${err.message}`)
    })

    namespace.on('connect_error', (error) => {
      console.log('Connection Error:', error)
    })

    namespace.on('connect', () => {
      console.log('Connected successfully')
    })

    namespace.on('disconnect', (reason) => {
      console.log('Disconnected:', reason)
    })
  }

  async handleConnection(client: Socket) {}

  @SubscribeMessage('join_chat')
  handleJoinRoom(client: Socket, payload: { conversationId: string }) {
    const roomName = payload.conversationId;
    client.join(roomName);
  }

  async emitNewMessage(conversationId: string, messageData: any) {
    this.namespace.to(conversationId).emit('messages', messageData);
  }
}
