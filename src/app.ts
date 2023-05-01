import express, { urlencoded, json, Application} from "express"
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import cookieSession from "cookie-session";
import compression from "compression";

const app: Application = express()

app.use(cookieSession({
    name: "session",
    maxAge: 24 * 7 * 60 * 60 * 1000,
    keys: ["test1", "test2"],
    secure: true, 
}))
app.use(compression())
app.use(hpp())
app.use(helmet())
app.use(cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH']
}))


const PORT = process.env.PORT || 4900

app.listen(PORT, () => {
    console.log(`Listening to your server on port ${PORT} sir 🫡`);
})