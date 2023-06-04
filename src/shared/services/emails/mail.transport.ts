import { createLogger } from "@global/helpers/logger";
import Logger from "bunyan";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import sendGridMail from "@sendgrid/mail";
import { BadRequestError } from "@global/helpers/error-handler";

const log: Logger = createLogger("mailOptions");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ( receiverEmail: string, subject: string, body: string): Promise<void> => {
    if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
      developmentEmailSender(receiverEmail, subject, body);
    } else {
      productionEmailSender(receiverEmail, subject, body);
    }
}

const developmentEmailSender = async ( receiverEmail: string, subject: string, body: string): Promise<void> => {
  const transporter: Mail = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASSWORD,
    },
  });
  const mailOptions: IMailOptions = {
      from: `Chat app <${process.env.SENDER_EMAIL}>`,
      to: receiverEmail,
      subject,
      html: body,
  };
  try {
      await transporter.sendMail(mailOptions);
      log.info("Email sent succesfully -- Development");
  } catch (error) {
    log.error("Error Sending Email", error)
    throw new BadRequestError('Error sending email - Development')
  }
};

const productionEmailSender = async ( receiverEmail: string, subject: string, body: string): Promise<void> => {
    const mailOptions: IMailOptions = {
      from: `Chat app <${process.env.SENDER_EMAIL}>`,
      to: receiverEmail,
      subject,
      html: body,
    };
    try {
      await sendGridMail.send(mailOptions);
      log.info('Email sent succesfully -- Production')
    } catch (error) {
      log.error("Error Sending Email", error);
      throw new BadRequestError("Error sending email  - Production");
    }
}