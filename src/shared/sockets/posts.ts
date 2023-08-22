import { createLogger } from "@global/helpers/logger";
import { Server, Socket } from "socket.io";

export let socketIOPostObject: Server;
const log = createLogger("Post Server");

export class SocketIOPostHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public listen(): void {
    this.io.on("connection", (_socket: Socket) => {
        log.info("Post Socket IO handler")
    })}

}
