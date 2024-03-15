import express from "express";
import { RoomController } from "../../controllers";

export default class RoomRoutes {
	public router: express.Router;
	private roomController: RoomController

	constructor() {
		this.router = express.Router();
		this.registerRoutes();
		this.roomController = new RoomController()
	}

	protected registerRoutes(): void {
		this.router.get("/health", async (_req, res, _next) => {
			try {
				res.send(await this.roomController.getHealth());
			} catch (e) {
				res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.post("/create", async (req, res, _next) => {
			try {
				res.send(await this.roomController.createRoom(req.body));
			} catch (e) {
				res.status(500).send({ error: "unknown Error" });
			}
		});

		this.router.post("/join/:id", async (_req, res, _next) => {
			try {
				// res.send(await this.roomController.joinRoom(req.params.id));
			} catch (e) {
				res.status(500).send({ error: "unknown Error" });
			}
		});
	}
}
