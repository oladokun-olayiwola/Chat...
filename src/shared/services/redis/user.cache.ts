import { BaseCache } from "@services/redis/base.cache";
import { IUserDocument } from "@user/interfaces/user.interface";
import Logger from "bunyan";
import { createLogger } from "@global/helpers/logger";
import { ServerError } from "@global/helpers/error-handler";
import { jsonParse } from "@global/helpers/helpers";

const log: Logger = createLogger("UserCache");

export class UserCache extends BaseCache {
  constructor() {
    super("UserCache");
  }

  public async saveUserToCache(
    key: string,
    userUid: string,
    createdUser: IUserDocument
  ): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social,
    } = createdUser;
    const firstList: string[] = [
      "_id",
      `${_id}`,
      "uId",
      `${uId}`,
      "username",
      `${username}`,
      "email",
      `${email}`,
      "avatarColor",
      `${avatarColor}`,
      "postsCount",
      `${postsCount}`,
      "profilePicture",
      `${profilePicture}`,
      "followersCount",
      `${followersCount}`,
      "followingCount",
      `${followingCount}`,
    ];
    const secondList: string[] = [
      "blocked",
      JSON.stringify(blocked),
      "blockedBy",
      JSON.stringify(blockedBy),
      "notifications",
      JSON.stringify(notifications),
      "social",
      JSON.stringify(social),
    ];
    const thirdList: string[] = [
      "work",
      `${work}`,
      "location",
      `${location}`,
      "school",
      `${school}`,
      "quote",
      `${quote}`,
      "bgImageId",
      `${bgImageId}`,
      "bgImageVersion",
      `${bgImageVersion}`,
    ];
    const dataToSave = [...firstList, ...secondList, ...thirdList, createdAt];

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.zAdd("user", {
        score: parseInt(userUid, 10),
        value: `${key}`,
      });
      for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
        await this.client.HSET(`users:${key}`, `${itemKey}`, `${itemValue}`);
      }
    } catch (error) {
      log.error(error);
      throw new ServerError("Server Error  USer Cache...");
    }
  }

  public async getUserFromCache(userId: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: IUserDocument = (await this.client.HGETALL(
        `users:${userId}`
      )) as unknown as IUserDocument;
      response.createdAt = new Date(jsonParse(`${response.createdAt}`));
      response.postsCount = jsonParse(`${response.postsCount}`)
      response.blocked = jsonParse(`${response.blocked}`)
      response.notifications = jsonParse(`${response.notifications}`)
      response.quote = jsonParse(`${response.quote}`);
      response.social = jsonParse(`${response.social}`)
      response.blockedBy = jsonParse(``)
      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError(
        "Server error, Try again... `get User from user user cache`"
      );
    }
  }
}
