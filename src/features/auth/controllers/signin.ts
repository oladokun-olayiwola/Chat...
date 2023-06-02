import { Request, Response } from "express";
import JWT from "jsonwebtoken";
import { joiValidation } from "@global/decorators/joi-validation-decorator";
import HTTP_STATUS from "http-status-codes";
import { getAuthUserByUsername } from "@services/db/auth.service";
import { loginSchema } from "@auth/schemes/signin";
import { IAuthDocument } from "@auth/interfaces/auth.interface";
import { BadRequestError } from "@global/helpers/error-handler";
import { getUserByAuthId }  from "@services/db/user.service";
import { IUserDocument } from "@user/interfaces/user.interface";
// import { resetPasswordTemplate } from "@services/emails/templates/reset-password/reset-password-template";

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await getAuthUserByUsername(
      username
    );
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }
    const user: IUserDocument = await getUserByAuthId(
      `${existingUser._id}`
    );
    const userJwt: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor,
      },
      process.env.JWT_TOKEN!,
    );
    // const resetLink = `${process.env.CLIENT_URL}/reset-password?token=122331343521342345563`;
    // // const templateParams = {
    // //   username: existingUser.username,
    // //   resetLink
    // // }
    // const template: string = resetPasswordTemplate(existingUser.username);

    req.session = { jwt: userJwt };
    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser!._id,
      username: existingUser!.username,
      email: existingUser!.email,
      avatarColor: existingUser!.avatarColor,
      uId: existingUser!.uId,
      createdAt: existingUser!.createdAt,
    } as IUserDocument;
    res
      .status(HTTP_STATUS.OK)
      .json({
        message: "User login successfully",
        user: userDocument,
        token: userJwt,
      });
  }
}

