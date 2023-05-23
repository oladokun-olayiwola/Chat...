import { AuthRouter } from "@auth/routes/authRoutes";
import { currentRouter } from "@auth/routes/currentRoutes";
import { serverAdapter } from "@services/queues/base.queue";
import { Application } from "express";

const BASE_URL = '/api/v1'

export default (app:Application) => {
    app.use("/queues", serverAdapter.getRouter())
    app.use(`${BASE_URL}/auth`, AuthRouter)
    app.use(`${BASE_URL}`, currentRouter);

}