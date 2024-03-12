import { Health } from "../../models";

export default class HealthService {
	public async getHealth(): Promise<Health> {
		return {
			message: "pong"
		};
	}
}
