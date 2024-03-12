import express from "express";
import { HealthRoutes } from "./authorization";
import { AuthRoutes } from "./auth";
import { APPCONFIGS } from "../configs";

const routes = (server: express.Application): void => {
	server.use(`${APPCONFIGS.BASE_PATH}/health`, new HealthRoutes().router);
	server.use(`${APPCONFIGS.BASE_PATH}/auth`, new AuthRoutes().router);
};

export default routes;
