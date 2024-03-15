import RoomService from "./roomService";

describe("Test health service", () => {
	const newHealthService = new RoomService();
	it("should succeed to return the `pong` message", async () => {
		expect((await newHealthService.getHealth()).message).toBe("pong");
	});
});
