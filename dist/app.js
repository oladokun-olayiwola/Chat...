import express, { urlencoded, json } from "express";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import cookieSession from "cookie-session";
import compression from "compression";
const app = express();
app.use(cookieSession({
    name: "session",
    maxAge: 24 * 7 * 60 * 60 * 1000,
    keys: ["test1", "test2"],
    secure: true,
}));
app.use(hpp());
app.use(helmet());
app.use(cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "PATCH"],
}));
app.use(compression());
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true, limit: "50mb" }));
app.get("/", (_, res) => { res.send("Please"); });
const PORT = process.env.PORT || 4900;
app.listen(PORT, () => {
    console.log(`Listening to your server on port ${PORT} sir 🫡`);
});
//# sourceMappingURL=app.js.map