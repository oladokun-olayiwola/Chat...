"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketIO = void 0;
const socket_io_1 = require("socket.io");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const createSocketIO = (httpServer) => __awaiter(void 0, void 0, void 0, function* () {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "PATCH"],
        },
    });
    const pubClient = (0, redis_1.createClient)({ url: process.env.REDIS_HOST });
    const subClient = pubClient.duplicate();
    yield Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
    return io;
});
exports.createSocketIO = createSocketIO;
