import { Body, Delete, Example, Get, Path, Post, Put, Route, Tags } from "tsoa";
import { Health, Message, Room } from "../../models";
import { RoomService } from "../../services";
import { ServiceResponse } from "../../utils";


@Route("/api/room")
@Tags("Room Controller")
export default class RoomController {
	private roomService: RoomService
	public emailContext: string
	constructor(

	) {

		this.emailContext = ''
		this.roomService = new RoomService()

	}
	/**
	 * Return all rooms
	 */
	@Example<{ data: { rooms: Room[] }, statusCode: number }>(
		{
			statusCode: 201,
			data: {
				rooms: [{
					id: 1,
					createdBy: 1,
					name: 'x1x1'
				}, {
					id: 2,
					createdBy: 2,
					name: 'x2x2'
				}]
			}
		}
	)
	@Get("/")
	public async getRooms(): Promise<ServiceResponse> {
		return this.roomService.getRooms();
	}

	/**
	 * Return singleRoom
	 */
	@Example<{ data: { room: Room }, statusCode: number }>(
		{
			statusCode: 201,
			data: {
				room: {
					id: 1,
					createdBy: 1,
					name: 'x1x1'
				}, 
			}
		}
	)
	@Get("/{roomId}")
	public async getRoom(@Path() roomId: number): Promise<Room | undefined> {
		return this.roomService.getRoomById(roomId);
	}
	/**
	 * Test if API is available
	 */
	@Example<Health[]>([
		{
			message: "pong"
		}
	])
	@Get("/health")
	public async getHealth(): Promise<Health> {
		return this.roomService.getHealth();
	}

	/**
	 * create new room
	 */
	@Example<{ data: { room: Room }, statusCode: number }>(
		{
			statusCode: 201,
			data: {
				room: {
					id: 1,
					createdBy: 1
				}
			}
		}
	)
	@Post('/create')
	public async createRoom(
		@Body() data: { name: string }
	): Promise<ServiceResponse> {
		return this.roomService.createRoom({name: data.name,  userEmail: this.emailContext})
	}

	/**
	   * join an existing room
	   */
	@Example<{ data: { room: Room }, statusCode: number }>(
		{
			statusCode: 201,
			data: {
				room: {
					id: 1,
					createdBy: 1
				}
			}
		}
	)
	@Post('/join/{roomId}')
	public async joinRoom(
		@Path() roomId: number
	): Promise<ServiceResponse> {
		return this.roomService.joinRoom({ roomId, userEmail: this.emailContext  })
	}

	/**
	   * update room details
	   */
	@Example<{ data: { room: Room }, statusCode: number }>(
		{
			statusCode: 201,
			data: {
				room: {
					id: 1,
					createdBy: 1
				}
			}
		}
	)
	@Put('/{roomId}')
	public async updateRoomDetails(
		@Path() roomId: number, @Body() data: { name: string },
	): Promise<ServiceResponse> {
		return this.roomService.updateRoomDetails({ id: roomId, name: data.name })
	}

	/**
	   * delete an existing room
	   */
	@Example<{ data: { room: Room }, statusCode: number }>(
		{
			statusCode: 201,
			data: {
				room: {
					id: 1,
					createdBy: 1
				}
			}
		}
	)
	@Delete('/{roomId}')
	public async deleteRoom(
		@Path() roomId: number,
	): Promise<ServiceResponse> {
		return this.roomService.deleteRoom(roomId)
	}

	/**
	   * get room chat list
	   */
	@Example<{ data: { chats: Message[] }, statusCode: number }>(
		{
			statusCode: 201,
			data: {
				chats: [{
					sender: 1,
					receiver: 2,
					id: 1,
					content: 'hello world',
					timestamp: new Date(),
				}]
			}
		}
	)
	@Get('/chats/{roomId}')
	public async getRoomChats(
		@Path() roomId: number
	): Promise<ServiceResponse> {
		return this.roomService.getRoomChats({ roomId, userEmail: this.emailContext  })
	}

	/**
	   * user leaves a room
	   */
	@Example<{ data: { room: Room }, statusCode: number }>(
		{
			statusCode: 201,
			data: {
				room: {
					id: 1,
					createdBy: 1
				}
			}
		}
	)
	@Post('/leave/{roomId}')
	public async leaveRoom(
		@Path() roomId: number
	): Promise<ServiceResponse> {
		return this.roomService.leaveRoom({ roomId, userEmail: this.emailContext  })
	}

	/**
	   * sends mssDE TO A ROOM
	   */
	@Example<{ data: { message: Message }, statusCode: number }>(
		{
			statusCode: 201,
			data: {
				message: {
					id: 1,
					sender: 1,
					content: 'Hey there world',
					timestamp: new Date()
				}
			}
		}
	)
	@Post('/send-message/{roomId}')
	public async sendMessage(
		@Path() roomId: number, @Body() content: string
	): Promise<ServiceResponse> {
		return this.roomService.sendMessage({ roomId, userEmail: this.emailContext, content  })
	}
}
