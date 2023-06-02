import { BaseQueue } from "@services/queues/base.queue";
import { IEmailJob } from "@user/interfaces/user.interface";
import { addNotificationEmail } from "@worker/email.worker";

class EmailQueue extends BaseQueue {
  constructor() {
    super("emails");
    this.processJob("forgotPasswordEmail", 5, addNotificationEmail)
  }

  public addEmailJob(name: string, data: IEmailJob): void {
    this.addJob(name, data);
  }
}

export const emailQueue: EmailQueue = new EmailQueue();
