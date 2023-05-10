import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { joiValidation } from "@global/decorators/joi-validation-decorator";
import { signupSchema } from "@auth/schemes/signup";
import { IAuthDocument, ISignUpData } from "@auth/interfaces/auth.interface";
import getUserByUsernameOrEmail from "@services/db/auth.service";
import { BadRequestError } from "@global/helpers/error-handler";
import { generateRandomIntegers } from "@global/helpers/helpers";
import { UploadApiResponse } from "cloudinary";
import { uploads } from "@global/helpers/cloudinaryUpload";
import StatusCodes from "http-status-codes";
import { IUserDocument } from "@user/interfaces/user.interface";
import { UserCache } from "@services/redis/user.cache";

export class SignUp {
  @joiValidation(signupSchema)
  static async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const checkIfUserExist: IAuthDocument = await getUserByUsernameOrEmail(
      username,
      email
    );
    if (checkIfUserExist) {
      throw new BadRequestError("Invalid credentials");
    }
    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${generateRandomIntegers(12)}`;

    const authData: IAuthDocument = SignUp.prototype.signUpData({
      _id: authObjectId,
      uId,
      username,
      password,
      avatarColor,
      email,
    });
    const result: UploadApiResponse = (await uploads(
      avatarImage,
      `${userObjectId}, true, true`
    )) as UploadApiResponse;
    // console.log("signup", result);

    if (!result?.public_id) {
      throw new BadRequestError("File Upload: Error occured. Try again.");
    }

    // Add to redis cache
    const userDataForCache: IUserDocument = SignUp.prototype.userData(
      authData,
      userObjectId
    );
    const UsersCache = new UserCache()
    userDataForCache.profilePicture = `https://res.cloudinary.com/dhoci8dog/image/upload/v${result.version}/${userObjectId}`;
    await UsersCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "User created successsfully", authData });
  }

  private signUpData(data: ISignUpData): IAuthDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id,
      uId,
      username,
      email,
      password,
      avatarColor,
      createdAt: new Date(),
    } as IAuthDocument;
  }

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, uId, username, email, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username,
      email,
      password,
      avatarColor,
      // profilePicture,
      blocked: [],
      blockedBy: [],
      work: "",
      location: "",
      school: "",
      quote: "",
      bgImageVersion: "",
      bgImageId: "",
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true,
      },
      social: {
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: "",
      },
    } as unknown as IUserDocument;
  }
}
