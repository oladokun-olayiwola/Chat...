import { DoneCallback, Job } from "bull";
import Logger from "bunyan";
import { createLogger } from "@global/helpers/logger";
import { AddUserData } from "@services/db/user.service";
const log: Logger = createLogger("Auth Worker");

export const addUserToDb = async (
  job: Job,
  done: DoneCallback
): Promise<void> => {
  try {
    const { value } = job.data;
    await AddUserData(value);
    job.progress(100);
    done(null, job.data);
  } catch (e) {
    log.error(e);
    done(e as Error);
  }
};
