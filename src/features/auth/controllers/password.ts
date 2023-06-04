import { Request, Response } from "express";
import { joiValidation } from "@global/decorators/joi-validation-decorator";
import HTTP_STATUS, { StatusCodes } from "http-status-codes";
import { getUserByEmail, updatePasswordToken } from "@services/db/auth.service";
import { IAuthDocument } from "@auth/interfaces/auth.interface";
import { BadRequestError } from "@global/helpers/error-handler";
import { getUserByAuthId } from "@services/db/user.service";
import { emailSchema } from "@auth/schemes/password";
import { createLogger } from "@global/helpers/logger";
import crypto from "crypto"
import { forgotPasswordTemplate } from "@services/emails/templates/forgot-password/forgot-password-template";
import { emailQueue } from "@services/queues/email.queue";


const log = createLogger("Password controller")


export class SignIn {
  @joiValidation(emailSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const existingUser: IAuthDocument = await getUserByEmail(email);
    if (!existingUser) {
        log.error("error", "password controller")
      throw new BadRequestError("Invalid credentials");
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20))
    const randomCharacters: string = randomBytes.toString('hex')
    await updatePasswordToken(`${existingUser._id}`, randomCharacters, Date.now() * 60 * 60 * 1000);

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${randomCharacters}`
    const template: string = forgotPasswordTemplate(existingUser.username, resetLink)
    emailQueue.addEmailJob("forgotPasswordEmail", { template, receiverEmail: email, subject: "Reset your Password"});
    res.status(StatusCodes.OK).json({ message: "PASSWORD RESET EMAIL SENT"})
  }
}
