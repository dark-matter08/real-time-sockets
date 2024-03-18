import { Health, Message, Room, RoomUser } from "../../models";
import { ResponseCode, ServiceResponse } from "../../utils";
import { AuthService } from "../auth";
import { SimpleDataService } from "../utils";

export default class RoomService {
    private authService: AuthService
    private roomDataService: SimpleDataService<Room>
    private roomUserJunctionDataService: SimpleDataService<RoomUser>
    private messageDataService: SimpleDataService<Message>

    constructor() {
        this.authService = new AuthService()
        this.roomDataService = new SimpleDataService<Room>('Room')
        this.messageDataService = new SimpleDataService<Message>('Message')
        this.roomUserJunctionDataService = new SimpleDataService<RoomUser>('Room_Users')
    }

    public async getRoomById(roomId: number, fields="*,members.*,createdBy.*, members.Users_id.*"): Promise<Room | undefined> {
        const room = await this.roomDataService.readByQuery({
            filter: {
                id: { _eq: roomId },
            },
            fields: fields,
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

    public async createRoom(data: { name: string, userEmail: string }): Promise<ServiceResponse> {
        const { name, userEmail } = data

        const user = await this.authService.getUserByEmail(userEmail);

        if (!user) {
            return {
                errorMessage: 'This user does not exists in the system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }


        const newRoom = await this.roomDataService.add({
            name,
            createdBy: user.id,
            date_created: new Date()
        })


        return {
            statusCode: 201,
            data: {
                room: newRoom,
            },
        };
    }

    public async joinRoom(data: { roomId: number, userEmail: string }): Promise<ServiceResponse> {
        const { roomId, userEmail } = data

        const user = await this.authService.getUserByEmail(userEmail);

        if (!user) {
            return {
                errorMessage: 'This user does not exists in the system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const room = await this.getRoomById(roomId, "*, members.*");
        if (!room) {
            return {
                errorMessage: 'This room does not exist in the system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const currentMembers = room.members ? room.members : []


        if (currentMembers?.filter((x: any) => x.Users_id === user?.id).length > 1) {
            return {
                errorMessage: 'This user is already in this room',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        try {

            const junction = await this.roomUserJunctionDataService.add({
                Room_id: room.id,
                Users_id: user.id
            })



            if(!junction){
                return {
                    errorMessage: 'An error occured trying to update room',
                    statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
                };
            }



            const newMembers = [...currentMembers, junction?.id]
            room.members = newMembers

            const roomData = await this.roomDataService.update(room);

            return {
                statusCode: 200,
                data: {
                    room: roomData,
                },
            };
        } catch (error) {
            return {
                errorMessage: 'An error occured trying to update room',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

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

    public async updateRoomDetails(data: Partial<Room>): Promise<ServiceResponse> {
        const { id, name } = data

        const room = await this.getRoomById(id as number)

        if (!room) {
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

    public async deleteRoom(roomId: number): Promise<ServiceResponse> {
        const room = await this.getRoomById(roomId)

        if (!room) {
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

    public async getRoomChats(data: { roomId: number, userEmail: string }): Promise<ServiceResponse> {
        const { roomId, userEmail } = data

        const user = await this.authService.getUserByEmail(userEmail);

        if (!user) {
            return {
                errorMessage: 'This user does not exists in the system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const room = await this.getRoomById(roomId)

        if (!room) {
            return {
                errorMessage: 'This room does not exist in our system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const currentMembers = room.members ? room.members : []


        if (currentMembers?.filter((x: any) => x.Users_id === user?.id).length > 1) {
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

    public async leaveRoom(data: { roomId: number, userEmail: string }): Promise<ServiceResponse> {
        const { roomId, userEmail } = data

        const user = await this.authService.getUserByEmail(userEmail);

        if (!user) {
            return {
                errorMessage: 'This user does not exists in the system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const room = await this.getRoomById(roomId, "*, members.*")

        if (!room) {
            return {
                errorMessage: 'This room does not exist in our system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }
        const currentMembers = room.members ? room.members : []

        if (currentMembers?.filter((x: any) => x?.Users_id === user?.id).length < 1) {
            return {
                errorMessage: 'This user does not belong to this room, returning null',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        // const userIndex = (room.members as number[]).findIndex((x) => x === userId)

        const roomsToRemove = room?.members?.filter((x: any) => {
            x.Users_id === user?.id
        })

        if(roomsToRemove){

            for (let index = 0; index < roomsToRemove.length; index++) {
                const element = roomsToRemove[index];
                await this.roomUserJunctionDataService.delete(element)
                
            }
        }
        

        const newMembers = room?.members?.filter((x: any) => {
            x.Users_id === user?.id
        }).map((x: any) => x.id)

        console.log(newMembers);
        

        room.members = newMembers as number[]
        const roomData = await this.roomDataService.update(room);

        return {
            statusCode: 200,
            data: {
                room: roomData,
            },
        };
    }

    public async sendMessage(data: { roomId: number, userEmail: string, content: string }): Promise<ServiceResponse> {
        const { roomId, userEmail, content } = data



        const user = await this.authService.getUserByEmail(userEmail);

        if (!user) {
            return {
                errorMessage: 'This user does not exists in the system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const room = await this.getRoomById(roomId)

        if (!room) {
            return {
                errorMessage: 'This room does not exist in our system',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const currentMembers = room.members ? room.members : []


        if (currentMembers?.filter((x: any) => x.Users_id === user?.id).length > 1) {
            return {
                errorMessage: 'This user does not belong to this room, cannot send message to this room',
                statusCode: ResponseCode.HTTP_400_BAD_REQUEST,
            };
        }

        const newMessage = await this.messageDataService.add({
            room: roomId,
            sender: user?.id,
            content
        })

        return {
            statusCode: 200,
            data: {
                message: newMessage,
            },
        };
    }

}
