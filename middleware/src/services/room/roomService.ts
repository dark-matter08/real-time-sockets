import { Health, Message, Room } from "../../models";
import { ResponseCode, ServiceResponse } from "../../utils";
import { AuthService } from "../auth";
import { SimpleDataService } from "../utils";

export default class RoomService {
    private authService: AuthService
    private roomDataService: SimpleDataService<Room>
    private messageDataService: SimpleDataService<Message>
    
    constructor(){
        this.authService = new AuthService()
        this.roomDataService =  new SimpleDataService<Room>('Room')
        this.messageDataService =  new SimpleDataService<Message>('Message')
    }

    private async getRoomById(roomId: number): Promise<Room | undefined> {
        const room = await this.roomDataService.readByQuery({
            filter: {
              id: { _eq: roomId },
            },
      
            limit: -1,
          });
      
          if (!room) {
            return undefined;
          }
      
          return room.length > 0 ? room[0] : undefined;
    }

	public async getHealth(): Promise<Health> {
		return {
			message: "pong"
		};
	}

    public async createRoom(data: {name: string, userId: number}): Promise<ServiceResponse> {
        const {name, userId} = data

        const user = await this.authService.getUserById(userId);

        if (!user) {
            return {
                errorMessage: 'This user does not exists in the system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }


        const newRoom = await this.roomDataService.add({
            name,
            createdBy: userId
        })


        return {
            statusCode: 201,
            data: {
                room: newRoom,
            },
        };
	}

    public async joinRoom(data: {roomId: number, userId: number}): Promise<ServiceResponse> {
        const {roomId, userId} = data

        const user = await this.authService.getUserById(userId);

        if (!user) {
            return {
                errorMessage: 'This user does not exists in the system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const room = await this.getRoomById(roomId);
        if (!room) {
            return {
                errorMessage: 'This room does not exist in the system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const currentMembers = room.members



        if(currentMembers?.includes(userId)){
            return {
                errorMessage: 'This user is already in this room',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }
        const newMembers = currentMembers && currentMembers?.length > 0 ? [...currentMembers, userId] : [] 

        room.members = newMembers as number[]

        const roomData = await this.roomDataService.update(room);

        return {
            statusCode: 200,
            data: {
                room: roomData,
            },
        };
    }

    public async getRooms(): Promise<ServiceResponse> {
        const rooms = await this.roomDataService.getAll()
          if (!rooms) {
            return {
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
                errorMessage: 'An error occured trying to fetch rooms',
            };
          }
      
          return {
            statusCode: 200,
            data: {
                rooms,
            },
        };
    }

    public async uploadRoomDetails(data: Partial<Room>): Promise<ServiceResponse> {
        const {id, name} = data

        const room = await this.getRoomById(id as number)

        if(!room){
            return {
                errorMessage: 'This room does not exist in our system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        room.name = name as string

        const roomData = await this.roomDataService.update(room);

        return {
            statusCode: 200,
            data: {
                room: roomData,
            },
        };

    }

    public async deleteRoom(roomId: number): Promise<ServiceResponse>{
        const room = await this.getRoomById(roomId)

        if(!room){
            return {
                errorMessage: 'This room does not exist in our system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        await this.roomDataService.delete(room)

        return {
            statusCode: 200,
            data: {
                room: room,
                message: 'Room deleted'
            },
        };
    }

    public async getRoomChats(data: {roomId: number, userId: number}): Promise<ServiceResponse>{
        const {roomId, userId} = data
        const room = await this.getRoomById(roomId)

        if(!room){
            return {
                errorMessage: 'This room does not exist in our system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        if(!room.members?.includes(userId)){
            return {
                errorMessage: 'This user does not belong to this room, cannot access chats',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const chats = await this.messageDataService.readByQuery({
            filter: {
                room: { _eq: roomId },
            },
          });

          return {
            statusCode: 200,
            data: {
                chats,
            },
        };

    }

    public async leaveRoom(data: {roomId: number, userId: number}): Promise<ServiceResponse>{
        const {roomId, userId} = data
        const room = await this.getRoomById(roomId)

        if(!room){
            return {
                errorMessage: 'This room does not exist in our system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const user = await this.authService.getUserById(userId);

        if (!user) {
            return {
                errorMessage: 'This user does not exists in the system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        if(!room.members?.includes(userId)){
            return {
                errorMessage: 'This user does not belong to this room, cannot access chats',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        // const userIndex = (room.members as number[]).findIndex((x) => x === userId)

        const newMembers = room?.members?.filter((x) => {
            x === userId
        })

        room.members = newMembers as number[]
        const roomData = await this.roomDataService.update(room);

        return {
            statusCode: 200,
            data: {
                room: roomData,
            },
        };
    }

}
