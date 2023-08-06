import { Server, Socket } from "socket.io";

export let socketIOPostObject: Server;
export class SocketIOPostHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public listen(): void {
    this.io.on("connection", (_socket: Socket) => {
        console.log("Post Socket IO handler")
    })}

}
