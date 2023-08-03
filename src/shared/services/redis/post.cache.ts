import { BaseCache } from '@services/redis/base.cache';
import Logger from 'bunyan';
import { ServerError } from '@global/helpers/error-handler';
import { ISavePostToCache } from '@post/interfaces/post.interface';
import { createLogger } from '@global/helpers/logger';

const log: Logger = createLogger('postCache');

export class PostCache extends BaseCache {
  constructor() {
    super('postCache');
  }

  public async savePostToCache(data: ISavePostToCache): Promise<void> {
    const { key, currentUserId, uId, createdPost } = data;
    const {
      _id,
      userId,
      username,
      email,
      avatarColor,
      profilePicture,
      post,
      bgColor,
      feelings,
      privacy,
      gifUrl,
      commentsCount,
      imgVersion,
      imgId,
      reactions,
      createdAt
    } = createdPost;

    const firstList: string[] = [
      '_id', `${_id}`,
      'userId', `${userId}`,
      'username', `${username}`,
      'email', `${email}`,
      'avatarColor', `${avatarColor}`,
      'profilePicture', `${profilePicture}`,
      'post', `${post}`,
      'bgColor', `${bgColor}`,
      'feelings', `${feelings}`,
      'privacy', `${privacy}`,
      'gifUrl', `${gifUrl}`,
    ];
    
    const secondList: string[] = [
      "commentsCount",
      `${commentsCount}`,
      "reactions",
      JSON.stringify(reactions),
      "imgVersion",
      `${imgVersion}`,
      "imgId",
      `${imgId}`,
      "createdAt",
      `${createdAt}`,
    ];

    const dataToSave: string[] = [...firstList, ...secondList];

    try {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
        const postCount: string[] = await this.client.HMGET(`users:${currentUserId}`, 'postsCount')
        const multi = this.client.multi();
        multi.ZADD('post', { score: parseInt(uId, 10), value: `${key}`});
        multi.HSET(`users:${currentUserId}`, dataToSave);
        const count: number = parseInt(postCount[0], 10) + 1;
        multi.HSET(`users:${currentUserId}`, ['postsCount', count]);
        multi.exec();
    } catch (error) {
        log.error(error)
        throw new ServerError("Server Error `post cache`  Try again...")
    }
  }}