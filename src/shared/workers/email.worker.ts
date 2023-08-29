import { DoneCallback, Job } from "bull";
import Logger from "bunyan";
import { createLogger } from "@global/helpers/logger";
import { sendEmail } from "@services/emails/mail.transport";

const log: Logger = createLogger("Auth Worker");

export const addNotificationEmail = async (
  job: Job,
  done: DoneCallback
): Promise<void> => {
  try {
    const { template, receiverEmail, subject } = job.data;
    await sendEmail(receiverEmail, subject, template);
    job.progress(100);
    done(null, job.data);
    return job.data;
  } catch (error) {
    log.error("addEmailNotification", error);
    done(error as Error);
  }
};
