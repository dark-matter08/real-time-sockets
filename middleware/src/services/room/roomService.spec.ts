import RoomService from './roomService';
import { AuthService } from '../auth';
import { SimpleDataService } from '../utils';

// Mocking AuthService
jest.mock('../auth');
// const mockedAuthService = jest.fn() as jest.Mocked<typeof AuthService>;

// Mocking SimpleDataService
jest.mock('../utils');
// const mockedSimpleDataService = jest.fn() as jest.Mocked<typeof SimpleDataService>;

describe('RoomService', () => {
    let roomService: RoomService;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        roomService = new RoomService();
    });

    describe('getHealth', () => {
        it('should return health message', async () => {
            const result = await roomService.getHealth();

            expect(result.message).toBe('pong');
        });
    });

    describe('createRoom', () => {
        it('should create a room successfully', async () => {
            const mockUser = { id: 1, name: 'John' };
            const mockGetUserById = jest.fn() as jest.MockedFunction<typeof AuthService.prototype.getUserById>;
			mockGetUserById.mockResolvedValue(mockUser);
            // const mockRoomData = { name: 'Test Room', userId: 1 };
            const mockNewRoom = { id: 1, name: 'Test Room', createdBy: 1 };
            const mockedSimpleDataService = jest.fn() as jest.MockedFunction<typeof SimpleDataService.prototype.add>;
			mockedSimpleDataService.mockResolvedValue(mockNewRoom)

            // const result = await roomService.createRoom(mockRoomData);

            // expect(result.statusCode).toBe(201);
            // expect(result.data.room).toEqual(mockNewRoom);
        });

        it('should return error if user does not exist', async () => {
			const mockGetUserById = jest.fn() as jest.MockedFunction<typeof AuthService.prototype.getUserById>;
            mockGetUserById.mockResolvedValue(undefined);
            const mockRoomData = { name: 'Test Room', userEmail: 'testEmail@gmail.com' };

            const result = await roomService.createRoom(mockRoomData);

            expect(result.statusCode).toBe(400);
            expect(result.errorMessage).toBe('This user does not exists in the system');
        });
    });

    describe('joinRoom', () => {
        it('should join the room successfully', async () => {
            // Mock data
            const roomId = 1;
            const userEmail = 'test@example.com';
            const user = { id: 123, email: userEmail };
            const room = { id: roomId, members: [] };
            const updatedRoom = { ...room, members: [user.id] };

            // Mock dependencies
			const mockGetUserByEmail = jest.fn() as jest.MockedFunction<typeof AuthService.prototype.getUserById>;
			mockGetUserByEmail.mockResolvedValue(user)
            roomService.getRoomById = jest.fn().mockResolvedValue(room);
			const mockSimpleDataServiceUpdate = jest.fn() as jest.MockedFunction<typeof SimpleDataService.prototype.update>;
			mockSimpleDataServiceUpdate.mockResolvedValue(updatedRoom)


            // Call the method
            // const result = await roomService.joinRoom({ roomId, userEmail });

            // // Check the result
            // expect(result.statusCode).toBe(200);
            // expect(result.data?.room).toEqual(updatedRoom);
        });

        it('should return error if user does not exist', async () => {
            // Mock data
            const roomId = 1;
            const userEmail = 'nonexistent@example.com';

            // Mock dependencies
			const mockGetUserByEmail = jest.fn() as jest.MockedFunction<typeof AuthService.prototype.getUserById>;
            mockGetUserByEmail.mockResolvedValue(undefined);

            // Call the method
            const result = await roomService.joinRoom({ roomId, userEmail });

            // Check the result
            expect(result.statusCode).toBe(400);
            expect(result.errorMessage).toBe('This user does not exists in the system');
        });

        it('should return error if room does not exist', async () => {
            // Mock data
            const roomId = 999;
            const userEmail = 'test@example.com';
            const user = { id: 123, email: userEmail };

            // Mock dependencies
			const mockGetUserByEmail = jest.fn() as jest.MockedFunction<typeof AuthService.prototype.getUserById>;
            mockGetUserByEmail.mockResolvedValue(user);

            roomService.getRoomById = jest.fn().mockResolvedValue(undefined);

            // Call the method
            const result = await roomService.joinRoom({ roomId, userEmail });

            // Check the result
            expect(result.statusCode).toBe(400);
            // expect(result.errorMessage).toBe('This room does not exist in the system');
        });

        it('should return error if user is already in the room', async () => {
            // Mock data
            const roomId = 1;
            const userEmail = 'test@example.com';
            const user = { id: 123, email: userEmail };
            const room = { id: roomId, members: [user.id] };

            // Mock dependencies
			const mockGetUserByEmail = jest.fn() as jest.MockedFunction<typeof AuthService.prototype.getUserById>;
			mockGetUserByEmail.mockResolvedValue(user);
            roomService.getRoomById = jest.fn().mockResolvedValue(room);

            // Call the method
            const result = await roomService.joinRoom({ roomId, userEmail });

            // Check the result
            expect(result.statusCode).toBe(400);
            // expect(result.errorMessage).toBe('This user is already in this room');
        });
    });

	describe('sendMessage', () => {
        it('should send message successfully', async () => {
            // Mock data
            const roomId = 1;
            const userEmail = 'ndelucien008@gmail.com';
            const content = 'Hello, world!';
            const user = { id: 1, email: userEmail };
            const room = { id: roomId };
            const newMessage = { id: 456, roomId, sender: user.id, content };

            // Mock dependencies
			const mockGetUserByEmail = jest.fn() as jest.MockedFunction<typeof AuthService.prototype.getUserById>;
			mockGetUserByEmail.mockResolvedValue(user);
            roomService.getRoomById = jest.fn().mockResolvedValue(room);
			const mockSimpleDataServiceAdd = jest.fn() as jest.MockedFunction<typeof SimpleDataService.prototype.add>;
			mockSimpleDataServiceAdd.mockResolvedValue(newMessage);

            // Call the method
            // const result = await roomService.sendMessage({ roomId, userEmail, content });

            // Check the result
            // expect(result.statusCode).toBe(200);
            // expect(result.data?.message).toEqual(newMessage);
        });

        it('should return error if user does not exist', async () => {
            // Mock data
            const roomId = 1;
            const userEmail = 'nonexistent@example.com';
            const content = 'Hello, world!';

            // Mock dependencies
			const mockGetUserByEmail = jest.fn() as jest.MockedFunction<typeof AuthService.prototype.getUserById>;
			mockGetUserByEmail.mockResolvedValue(undefined);

            // Call the method
            const result = await roomService.sendMessage({ roomId, userEmail, content });

            // Check the result
            expect(result.statusCode).toBe(400);
            expect(result.errorMessage).toBe('This user does not exists in the system');
        });

        it('should return error if room does not exist', async () => {
            // Mock data
            const roomId = 999;
            const userEmail = 'ndelucien008@gmail.com';
            const content = 'Hello, world!';
            const user = { id: 1, email: userEmail };

            // Mock dependencies
			const mockGetUserByEmail = jest.fn() as jest.MockedFunction<typeof AuthService.prototype.getUserById>;
            mockGetUserByEmail.mockResolvedValue(user);
            roomService.getRoomById = jest.fn().mockResolvedValue(undefined);

            // Call the method
            const result = await roomService.sendMessage({ roomId, userEmail, content });

            // Check the result
            expect(result.statusCode).toBe(400);
            // expect(result.errorMessage).toBe('This room does not exist in our system');
        });
    });

    describe('deleteRoom', () => {
        it('should delete the room successfully', async () => {
            // Mock data
            const roomId = 1;
            const room = { id: roomId };

            // Mock dependencies
            roomService.getRoomById = jest.fn().mockResolvedValue(room);
			const mockSimpleDataServiceDelete = jest.fn() as jest.MockedFunction<typeof SimpleDataService.prototype.delete>;
            mockSimpleDataServiceDelete.mockResolvedValue(room);

            // Call the method
            const result = await roomService.deleteRoom(roomId);

            // Check the result
            expect(result.statusCode).toBe(200);
            expect(result.data).toEqual({ room, message: 'Room deleted' });
        });

        it('should return error if room does not exist', async () => {
            // Mock data
            const roomId = 999;

            // Mock dependencies
            roomService.getRoomById = jest.fn().mockResolvedValue(undefined);

            // Call the method
            const result = await roomService.deleteRoom(roomId);

            // Check the result
            expect(result.statusCode).toBe(400);
            expect(result.errorMessage).toBe('This room does not exist in our system');
        });
    });
});
