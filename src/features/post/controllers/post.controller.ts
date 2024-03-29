import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { joiValidation } from "@global/decorators/joi-validation-decorator";
import { postSchema } from "@post/schemes/post.schemes";
import { IPostDocument } from "@post/interfaces/post.interface";
import { StatusCodes } from "http-status-codes";
import { PostCache } from "@services/redis/post.cache";
import { socketIOPostObject } from "@socket/posts";
import { postQueue } from "@services/queues/post.queue";
import { uploads } from "@global/helpers/cloudinaryUpload";
import { BadRequestError } from "@global/helpers/error-handler";
import { UploadApiResponse } from "cloudinary";

const postCache: PostCache = new PostCache();
export class Create {
  @joiValidation(postSchema)
  public async post(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings } =
      req.body;

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
    socketIOPostObject.emit("add post", createdPost);
    await postCache.savePostToCache({
      key: postObjectId,
      currentUserId: `${req.currentUser!.userId}`,
      uId: `${req.currentUser!.uId}`,
      createdPost,
    });
    postQueue.addPostJob("addPostToDB", {
      key: req.currentUser!.userId,
      value: createdPost,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Post Created Successfully!" });
  }

  @joiValidation(postSchema)
  public async PostwithImage(req: Request, res: Response) {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings, image } =
      req.body;
    const result: UploadApiResponse = (await uploads(
      image
    )) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError(result?.message);
    }

    const postObjectId: ObjectId = new ObjectId();
    const createdPost: IPostDocument = {
      _id: postObjectId,
      userId: req.currentUser!.userId,
      username: req.currentUser!.username,
      email: req.currentUser!.email,
      avatarColor: req.currentUser!.avatarColor,
      profilePicture,
      post,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      commentsCount: 0,
      imgVersion: result.version.toString(),
      imgId: result.public_id,
      videoId: "",
      videoVersion: "",
      createdAt: new Date(),
      reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 },
    } as IPostDocument;

    socketIOPostObject.emit("add post", createdPost);
    await postCache.savePostToCache({
      key: postObjectId,
      currentUserId: `${req.currentUser!.userId}`,
      uId: `${req.currentUser!.uId}`,
      createdPost,
    });
    postQueue.addPostJob("addPostToDB", {
      key: req.currentUser!.userId,
      value: createdPost,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Post created with image successfully" });
  }
}
