import { IAuthJob } from "@auth/interfaces/auth.interface";
import { baseQueue } from "./base.queue";
import { addAuthUserToDb } from "@worker/auth.worker";

class AuthQueue extends baseQueue {
    constructor() {
        super("auth");
        this.processJob("addAuthUserToDb", 5, addAuthUserToDb)
    }

    public addAuthUserJob(name: string, data: IAuthJob): void {
        this.addJob(name, data)
    }
}

export const authQueue = new AuthQueue()