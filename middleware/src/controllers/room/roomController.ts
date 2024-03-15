import { Body, Example, Get, Post, Route, Tags } from "tsoa";
import { Health, Room } from "../../models";
import { RoomService } from "../../services";
import { ServiceResponse } from "../../utils";


@Route("/api/room")
@Tags("Room Controller")
export default class RoomController {
	private roomService: RoomService
	constructor(
		
	){

		this.roomService = new RoomService()

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
	 * create room
	 */
	@Example<{data: {room: Room}, statusCode: number}>(
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
    @Body() data: {  name: string, userId: number }
  ): Promise<ServiceResponse> {
	return this.roomService.createRoom(data)
  }

  /**
	 * create room
	 */
// 	@Example<{data: {room: Room}, statusCode: number}>(
// 		{
// 			statusCode: 201,
// 			data: {
// 				room: {
// 					id: 1,
// 					createdBy: 1
// 				}
// 			}
// 		}
// 	)
// // 	@Post('/joinRoom')
//   public async joinRoom(
//     @Param() data: {  name: string, userId: number }
//   ): Promise<ServiceResponse> {
// 	return this.roomService.createRoom(data)
//   }
}
