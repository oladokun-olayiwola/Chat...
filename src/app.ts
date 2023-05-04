import dotenv from "dotenv"
import express, { urlencoded, json, Application, NextFunction, Request, Response, } from "express";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import cookieSession from "cookie-session";
import compression from "compression";
import http from "http"
import morgan from "morgan"
import { StatusCodes } from "http-status-codes";

import { CustomError, IErrorResponse } from "@global/helpers/error-handler";
import { connectDB } from "@root/setupDatabase";
import { createSocketIO } from "@root/setupServer";
import { createLogger } from "@global/helpers/logger";




dotenv.config({})

const app: Application = express();
const log = createLogger("Server")

app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 7 * 60 * 60 * 1000,
    keys: ["test1", "test2"],
    secure: true,
  })
);

app.use(hpp());
app.use(helmet());
app.use(
    cors({
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "PATCH"],
    })
    );
    app.use(compression());
    app.use(json({ limit: "50mb"}));
    app.use(urlencoded({extended: true, limit: "50mb"}));
    app.use(morgan("dev"))

app.get("/", (_, res) => { log.info("DOne"), res.send("Please")});


app.all("*", (req: Request, res: Response) => {
     return   res.status(StatusCodes.BAD_REQUEST).json({message: `${req.originalUrl} not found`})
})

app.use((err: IErrorResponse, _req: Request, res:Response, next: NextFunction) => {
  log.error(err);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serializeErrors())
  }
  return next()
})


const PORT = process.env.PORT || 4900;

const start:() => void = async () => {
      const httpServer = new http.Server(app);
       await connectDB(process.env.MONGO_URI as string);
       await createSocketIO(httpServer)
       app.listen(PORT, () => {
         log.info(`Listening to your server on port ${PORT} sir 😎`);
       }); 
}
start()
