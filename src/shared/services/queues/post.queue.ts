import { BaseQueue } from "./base.queue";
import { IPostJobData } from "@post/interfaces/post.interface";
import { savePostToDb } from "@worker/post.worker";

class PostQueue extends BaseQueue {
  constructor() {
    super("post");
    this.processJob("addPostToDb", 5, savePostToDb);
  }

  public addPostJob(name: string, data: IPostJobData): void {
    this.addJob(name, data);
  }
}

export const postQueue = new PostQueue();
