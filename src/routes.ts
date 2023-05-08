import { AuthRouter } from "@auth/routes/routes";
import { Application } from "express";

const BASE_URL = '/api/v1'

export default (app:Application) => {
    app.use(`${BASE_URL}/auth`, AuthRouter)
}