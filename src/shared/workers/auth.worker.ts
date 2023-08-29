import { DoneCallback, Job } from "bull";
import Logger from "bunyan";
import { createLogger } from "@global/helpers/logger";
import { createAuthUser } from "@services/db/auth.service";

const log: Logger = createLogger("Auth Worker");

export const addAuthUserToDb = async (
  job: Job,
  done: DoneCallback
): Promise<void> => {
  try {
    const { value } = job.data;
    await createAuthUser(value);
    job.progress(100);
    done(null, job.data);
    return job.data;
  } catch (error) {
    log.error("addUserAuth", error);
    done(error as Error);
  }
};
