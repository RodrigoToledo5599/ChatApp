import 'dotenv/config'
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Namespace, Socket } from 'socket.io'
import * as cookie from 'cookie'
import { JwtStrategy } from '../../middleware/strategies/jwt.strategy'
import { PrismaService } from '../prisma/prisma.service'

const userRoom = (userId: string) => `user:${userId}`

@WebSocketGateway({
  pingInterval: 10000,
  pingTimeout: 5000,
  allowEIO3: true,
  cors: {
    origin: process.env.FRONT_END_URL,
    credentials: true
  },
  namespace: '/messages',
  transports: ['websocket']
})
export class WebSocketMessageService implements OnGatewayConnection {
  

  @WebSocketServer()
  public readonly namespace!: Namespace
  
  constructor(
    private readonly jwtStrategy: JwtStrategy,
    private readonly prisma: PrismaService
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

  // cada usuário entra numa sala própria para receber avisos (novas conversas, mudanças de amizade)
  async handleConnection(client: Socket) {
    const userId = (client as any).user?.id;
    if (userId)
      client.join(userRoom(userId));
  }

  @SubscribeMessage('join_chat')
  async handleJoinRoom(client: Socket, payload: { conversationId: string }) {
    const userId = (client as any).user?.id;
    const conversationId = payload?.conversationId;

    if (!userId || typeof conversationId !== 'string' || !conversationId)
      return { ok: false, error: 'Invalid payload' };

    const userOnConversation = await this.prisma.usersOnConversations.findUnique({
      where: { userId_conversationId: { userId, conversationId } }
    });

    if (!userOnConversation)
      return { ok: false, error: 'You are not allowed to join this conversation' };

    client.join(conversationId);
    return { ok: true };
  }

  @SubscribeMessage('leave_chat')
  handleLeaveRoom(client: Socket, payload: { conversationId: string }) {
    const conversationId = payload?.conversationId;
    if (typeof conversationId === 'string')
      client.leave(conversationId);
  }

  async emitNewMessage(conversationId: string, messageData: any) {
    this.namespace.to(conversationId).emit('messages', messageData);
  }

  notifyUsers(userIds: string[], event: 'conversations_updated' | 'friends_updated') {
    if (userIds.length === 0)
      return;
    this.namespace.to(userIds.map(userRoom)).emit(event);
  }

  async getActiveRooms(): Promise<{ rooms: string[]; totalConnections: number }> {
    const sockets = await this.namespace.fetchSockets();
    const customRooms = new Set<string>();

    for (const socket of sockets) {
      for (const room of socket.rooms) {
        if (room !== socket.id) {
          customRooms.add(room);
        }
      }
    }

    return {
      rooms: Array.from(customRooms),
      totalConnections: sockets.length
    };
  }
}
