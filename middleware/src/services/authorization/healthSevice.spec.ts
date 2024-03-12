import HealthService from "./healthService";

describe("Test health service", () => {
	const newHealthService = new HealthService();
	it("should succeed to return the `pong` message", async () => {
		expect((await newHealthService.getHealth()).message).toBe("pong");
	});
});
