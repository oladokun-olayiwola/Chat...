import { AuthRouter } from "@auth/routes/routes";
import { serverAdapter } from "@services/queues/base.queue";
import { Application } from "express";

const BASE_URL = '/api/v1'

export default (app:Application) => {
    app.use("/queues", serverAdapter.getRouter())
    app.use(`${BASE_URL}/auth`, AuthRouter)
}