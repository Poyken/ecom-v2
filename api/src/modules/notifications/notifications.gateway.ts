
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins for now, specific in prod
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationsGateway');
  // Map userId -> socketId[]
  private userSockets: Map<string, string[]> = new Map();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Auth check via query param or headers
      let token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      // fallback to cookie
      if (!token && client.handshake.headers.cookie) {
          const cookies = client.handshake.headers.cookie.split(';').reduce((acc, cookie) => {
              const [key, value] = cookie.trim().split('=');
              acc[key] = value;
              return acc;
          }, {} as Record<string, string>);
          token = cookies['accessToken'];
      }

      if (!token) {
        this.logger.warn(`Client ${client.id} failed auth: No token`);
        client.disconnect();
        return;
      }

      // Verify token
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Register socket
      const sockets = this.userSockets.get(userId) || [];
      sockets.push(client.id);
      this.userSockets.set(userId, sockets);

      // Join room for easier multicasting (roomId = userId)
      client.join(userId);

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (e) {
      this.logger.error('Connection unauthorized', e);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Clean up would require reverse map or linear scan. 
    // For simplicity, room auto-leave handles the emission logic.
    // But we should clean map to prevent memory leak
    for (const [userId, sockets] of this.userSockets.entries()) {
        const index = sockets.indexOf(client.id);
        if (index !== -1) {
            sockets.splice(index, 1);
            if (sockets.length === 0) {
                this.userSockets.delete(userId);
            }
            break;
        }
    }
  }

  // Method to emit notification to valid user
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(userId).emit(event, data);
  }
}
