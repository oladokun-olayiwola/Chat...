import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import http from "http"


export const createSocketIO = async (httpServer: http.Server): Promise<Server> => {
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH"],
      },
    });
    const pubClient = createClient({ url: process.env.REDIS_HOST})
    const subClient = pubClient.duplicate()
    await Promise.all([pubClient.connect(), subClient.connect()])
    io.adapter(createAdapter(pubClient, subClient))
    return io
} 