import { getUserById } from "@services/db/user.service";
import { UserCache } from "@services/redis/user.cache"
import { IUserDocument } from "@user/interfaces/user.interface";
import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";

const userCache: UserCache =  new UserCache();

export const currentUser = async (req: Request, res: Response) => {
    let isUser = false;
    let token = null;
    let user = null;
    
    const cachedUser: IUserDocument = await userCache.getUserFromCache(`${req.currentUser?.userId}`) as IUserDocument
    const existingUser: IUserDocument = cachedUser
      ? cachedUser
      : await getUserById(`${req.currentUser?.userId}`);
      if(Object.keys(existingUser).length) {
        user = existingUser;
        isUser =  true;
        token = req.session?.jwt
      }
      res.status(StatusCodes.OK).json({ token: token,isUser, user: user, message: "User active" })
} 