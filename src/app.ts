import express, { urlencoded, json, Application } from "express";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import cookieSession from "cookie-session";
import compression from "compression";
import { connectDB } from "./setupDatabase";

const app: Application = express();

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


app.get("/", (_, res) => {res.send("Please")});

const PORT = process.env.PORT || 4900;

const start:() => void = async () => {
    try {
       await connectDB(process.env.MONGO_URI as string);
       app.listen(PORT, () => {
         console.log(`Listening to your sevrer on port ${PORT} sir 😎`);
       }); 
    } catch (error) {
        console.log("Error connecting to the database")
        process.exit(1)
    }
}
start()