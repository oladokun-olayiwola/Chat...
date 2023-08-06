import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { joiValidation } from "@global/decorators/joi-validation-decorator";
import { postSchema } from "@post/schemes/post.schemes";
import { IPostDocument } from "@post/interfaces/post.interface";
import { StatusCodes } from "http-status-codes";
import { PostCache } from "@services/redis/post.cache";
import { SocketIOPostHandler, socketIOPostObject } from "@socket/posts";

export class Create {
  @joiValidation(postSchema)
  public async post(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings } =
      req.body;
    const postCache: PostCache = new PostCache();

    const postObjectId: ObjectId = new ObjectId();
    const createdPost: IPostDocument = {
      _id: postObjectId,
      userId: req.currentUser!.userId,
      username: req.currentUser!.username,
      email: req.currentUser!.email,
      avatarColor: req.currentUser!.avatarColor,
      post,
      bgColor,
      privacy,
      gifUrl,
      profilePicture,
      feelings,
      imgId: "",
      imgVersion: "",
      createdAt: new Date(),
      reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 },
    } as IPostDocument;
    socketIOPostObject.emit('add post', createdPost)
    await postCache.savePostToCache({
      key: postObjectId,
      currentUserId: `${req.currentUser!.userId}`,
      uId: `${req.currentUser!.uId}`,
      createdPost,
    });

    res
      .status(StatusCodes.CREATED)
      .json({message: "Post Created Successfully"});
  }
}
