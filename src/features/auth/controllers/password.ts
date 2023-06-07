import { Request, Response } from "express";
import { joiValidation } from "@global/decorators/joi-validation-decorator";
import { StatusCodes } from "http-status-codes";
import { getUserByEmail, updatePasswordToken } from "@services/db/auth.service";
import { IAuthDocument } from "@auth/interfaces/auth.interface";
import { BadRequestError } from "@global/helpers/error-handler";
import { emailSchema } from "@auth/schemes/password";
import { createLogger } from "@global/helpers/logger";
import crypto from "crypto"
import { forgotPasswordTemplate } from "@services/emails/templates/forgot-password/forgot-password-template";
import { emailQueue } from "@services/queues/email.queue";
import { IResetPasswordParams } from "@user/interfaces/user.interface";
import moment from "moment";
import publicIP from "ip"
import { resetPasswordTemplate } from "@services/emails/templates/reset-password/reset-password-template";


const log = createLogger("Password controller")


export class Password {
  @joiValidation(emailSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const existingUser: IAuthDocument = await getUserByEmail(email);
    if (!existingUser) {
      log.error("error", "password controller");
      throw new BadRequestError("Invalid credentials");
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString("hex");
    await updatePasswordToken(
      `${existingUser._id}`,
      randomCharacters,
      Date.now() * 60 * 60 * 1000
    );

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${randomCharacters}`;
    const template: string = forgotPasswordTemplate(
      existingUser.username,
      resetLink
    );
    emailQueue.addEmailJob("forgotPasswordEmail", {
      template,
      receiverEmail: email,
      subject: "Reset your Password",
    });
    res.status(StatusCodes.OK).json({ message: "PASSWORD RESET EMAIL SENT" });
  }

  @joiValidation(emailSchema)
  public async update(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword } = req.body;
    const { token } = req.params
    if (password!== confirmPassword) {
      throw new BadRequestError('Passwords do not match');
    }
    const existingUser: IAuthDocument = await getUserByEmail(token);
    if (!existingUser) {
      throw new BadRequestError("Reset TOken has expired");
    }

    existingUser.password = password
    existingUser.passwordResetExpires = undefined
    existingUser.passwordResetToken = undefined
    await existingUser.save();

    const templateParams: IResetPasswordParams = {
      username: existingUser.username,
      email: existingUser.email,
      ipaddress: publicIP.address(),
      date: moment().format('DD/MM/YYYY HH:mm')
    }

    const template: string = resetPasswordTemplate(
      templateParams
    );
    emailQueue.addEmailJob("forgotPasswordEmail", {
      template,
      receiverEmail: existingUser.email,
      subject: "Password Reset Confirmation",
    });
    res.status(StatusCodes.OK).json({ message: "PASSWORD SUCCESSFULLY UPDATED" });
  }
}
