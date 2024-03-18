// export { default as SocketService } from "./socketService";

import { Server, Socket } from "socket.io";
import SocketService from "./socketService";

let socketInstance: Socket | null
let ioInstance: Server
export const start_socket = (app: Express.Application) => {
    const socketInit = new SocketService(app)
    socketInstance = socketInit.socket
    ioInstance = socketInit.io

}

export {socketInstance, ioInstance}