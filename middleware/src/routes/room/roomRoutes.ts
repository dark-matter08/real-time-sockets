import express from "express";
import { RoomController } from "../../controllers";
import { Socket } from "socket.io";
import { socketInstance } from "../../utils/socket-service";
// import { SocketService } from "../../utils/socket-service";

export default class RoomRoutes {
	public router: express.Router;
	private roomController: RoomController
	private socketInstance: Socket

	constructor() {
		this.router = express.Router();
		this.registerRoutes();
		this.roomController = new RoomController()
		this.socketInstance = socketInstance
	}

	protected registerRoutes(): void {
		this.router.get("/", async (_req, res, _next) => {
			try {
				return res.send(await this.roomController.getRooms());
			} catch (e) {
				return res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.get("/:id", async (req, res, _next) => {
			try {
				if (isNaN(parseInt(req.params.id))) {
					return res.status(500).send({ error: "Invalid room id" });
				}
				return res.send(await this.roomController.getRoom(parseInt(req.params.id)));
			} catch (e) {
				return res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.get("/health", async (_req, res, _next) => {
			try {
				return res.send(await this.roomController.getHealth());
			} catch (e) {
				return res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.post("/create", async (req, res, _next) => {
			try {
				this.roomController.emailContext = res.locals['email']
				return res.send(await this.roomController.createRoom(req.body));
			} catch (e) {
				return res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.post("/join/:id", async (req, res, _next) => {
			try {
				if (isNaN(parseInt(req.params.id))) {
					return res.status(500).send({ error: "Invalid room id" });
				}
				this.roomController.emailContext = res.locals['email']
				return res.send(await this.roomController.joinRoom(parseInt(req.params.id)));
			} catch (e) {
				return res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.put("/:id", async (req, res, _next) => {
			try {
				if (isNaN(parseInt(req.params.id))) {
					return res.status(500).send({ error: "Invalid room id" });
				}
				return res.send(await this.roomController.updateRoomDetails(parseInt(req.params.id), req.body));
			} catch (e) {
				return res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.delete("/:id", async (req, res, _next) => {
			try {
				if (isNaN(parseInt(req.params.id))) {
					return res.status(500).send({ error: "Invalid room id" });
				}
				return res.send(await this.roomController.deleteRoom(parseInt(req.params.id)));
			} catch (e) {
				return res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.get("/chats/:id", async (req, res, _next) => {
			try {
				if (isNaN(parseInt(req.params.id))) {
					return res.status(500).send({ error: "Invalid room id" });
				}
				this.roomController.emailContext = res.locals['email']
				return res.send(await this.roomController.getRoomChats(parseInt(req.params.id)));
			} catch (e) {
				return res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.post("/leave/:id", async (req, res, _next) => {
			try {
				if (isNaN(parseInt(req.params.id))) {
					return res.status(500).send({ error: "Invalid room id" });
				}
				this.roomController.emailContext = res.locals['email']

				return res.send(await this.roomController.leaveRoom(parseInt(req.params.id)));
			} catch (e) {
				return res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.post("/socket-join/:id", async (req, res, _next) => {
			try {
				if (isNaN(parseInt(req.params.id))) {
					return res.status(500).send({ error: "Invalid room id" });
				}

				const room = await this.roomController.getRoom(parseInt(req.params.id))
				if(!room){
					return res.status(500).send({ error: "Room with that id does not exists" });
				}
				
				this.socketInstance?.emit('joinRoom', parseInt(req.params.id))
				return res.send({message: `You have joined live message on room: ${room.name}` });
			} catch (e) {
				return res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.post("/send-message/:id", async (req, res, _next) => {
			try {
				if (isNaN(parseInt(req.params.id))) {
					return res.status(500).send({ error: "Invalid room id" });
				}

				this.roomController.emailContext = res.locals['email']

				const result = await this.roomController.sendMessage(parseInt(req.params.id), req.body)
				
				res.send(result);
				this.socketInstance?.emit('sendMessage', {roomId: parseInt(req.params.id), message: result.data.message})
				return
			} catch (e) {
				return res.status(500).send({ error: "unknown Error" });
			}
		});

	}
}
