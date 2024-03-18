import { Server, Socket } from 'socket.io';
import http from 'http'

export default class SocketService {

    public socket: Socket | null
    private activeRooms: {}
    public io: Server
    constructor(app: Express.Application) {
        const server = http.createServer(app)
        this.io = new Server(server)
        this.socket = null
        this.activeRooms = {}
        console.log("============== Socket Server Started =============");

        
        
        this.io.on('connection', (socket: Socket) => {
            console.log('=============+> A user connected <+=');
            this.socket = socket
            this.startSocketListeners()
        })

    }

    private startSocketListeners() {
        // Join room
        this.socket?.on('joinRoom', (roomId) => {
            this.activeRooms[roomId] = [...(this.activeRooms?.[roomId] || []), this.socket?.id];
            this.socket?.join(roomId);
            this.socket?.emit('connected', { roomId });
        });

        // Handle disconnection
        this.socket?.on('disconnect', () => {
            // Loop through active rooms
            for (const roomId in this.activeRooms) {
                if (Object.prototype.hasOwnProperty.call(this.activeRooms, roomId)) {
                    // Remove disconnected socket from activeRooms for each room
                    this.activeRooms[roomId] = this.activeRooms[roomId].filter(socketId => socketId !== this.socket?.id);
                }
            }
        });

        this.socket?.on('sendMessage', (data) => {
            const { roomId, message } = data;
            console.log("Sending ", message," to room: ", roomId);
            
            this.io.to(roomId).emit('newMessage', { roomId, message });
        });

        this.socket?.on('sendMessage-singleBroadcast', (data) => {
            const { roomId, message } = data;
            const roomSockets = this.activeRooms[roomId] || [];

            // Iterate over each socket ID in the room and send the message individually
            roomSockets.forEach(socketId => {
                this.io.to(socketId).emit('newMessage', { roomId, message });
            });
        });
    }
}