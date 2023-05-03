"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const compression_1 = __importDefault(require("compression"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const setupDatabase_1 = require("./setupDatabase");
const setupServer_1 = require("./setupServer");
dotenv_1.default.config({});
const app = (0, express_1.default)();
app.use((0, cookie_session_1.default)({
    name: "session",
    maxAge: 24 * 7 * 60 * 60 * 1000,
    keys: ["test1", "test2"],
    secure: true,
}));
app.use((0, hpp_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "PATCH"],
}));
app.use((0, compression_1.default)());
app.use((0, express_1.json)({ limit: "50mb" }));
app.use((0, express_1.urlencoded)({ extended: true, limit: "50mb" }));
app.use((0, morgan_1.default)("dev"));
app.get("/", (_, res) => { res.send("Please"); });
const PORT = process.env.PORT || 4900;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const httpServer = new http_1.default.Server(app);
    yield (0, setupDatabase_1.connectDB)(process.env.MONGO_URI);
    yield (0, setupServer_1.createSocketIO)(httpServer);
    app.listen(PORT, () => {
        console.log(`Listening to your server on port ${PORT} sir 😎`);
    });
});
start();
