import Room from "../room/room";
import { User } from "../user";

export default interface RoomUser {
	id: number;
	Room_id: Room;
	Users_id: User;
}