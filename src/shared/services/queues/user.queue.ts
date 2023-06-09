import { BaseQueue } from "./base.queue";
import { addUserToDb } from "@worker/user.worker";

class UserQueue extends BaseQueue {
  constructor() {
    super("user");
    this.processJob("addUserToDb", 5, addUserToDb);
  }

  public addUserJob(name: string, data: any): void {
    this.addJob(name, data);
  }
}

export const userQueue = new UserQueue();
