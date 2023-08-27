import { DoneCallback, Job } from "bull";
import Logger from "bunyan";
import { createLogger } from "@global/helpers/logger";
import { postService } from "@services/db/post.service";
const log: Logger = createLogger("Post Worker");

export const savePostToDb = async (
  job: Job,
  done: DoneCallback
): Promise<void> => {
  try {
    const { value, key } = job.data;
    await postService.addPostToDB(value, key);
    job.progress(100);
    done(null, job.data);
  } catch (error) {
    log.error("addPost", error);
    done(error as Error);
  }
};
