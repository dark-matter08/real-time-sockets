// export { default as SocketService } from "./socketService";

import SocketService from "./socketService";

let socketInstance: any
export const start_socket = (app: Express.Application) => {
    const socketInit = new SocketService(app)
    socketInstance = socketInit.socket
}

export {socketInstance}