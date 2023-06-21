import { IAuthDocument } from "@auth/interfaces/auth.interface";
import { AuthModel } from "@auth/models/auth.schema";
import { UserModel } from "@user/models/user.schema";
import mongoose from "mongoose";
import { IUserDocument } from "@user/interfaces/user.interface";

export async function AddUserData(data: IAuthDocument): Promise<void> {
  await UserModel.create(data);
}

export async function getUserByUsernameOrEmail(
  username: string,
  email: string
): Promise<IAuthDocument> {
  const query = {
    $or: [{ username }, { email }],
  };
  const user: IAuthDocument = (await AuthModel.findOne(
    query
  ).exec()) as IAuthDocument;
  return user;
}

function aggregateProject() {
    return {
      _id: 1,
      username: '$authId.username',
      uId: '$authId.uId',
      email: '$authId.email',
      avatarColor: '$authId.avatarColor',
      createdAt: '$authId.createdAt',
      postsCount: 1,
      work: 1,
      school: 1,
      quote: 1,
      location: 1,
      blocked: 1,
      blockedBy: 1,
      followersCount: 1,
      followingCount: 1,
      notifications: 1,
      social: 1,
      bgImageVersion: 1,
      bgImageId: 1,
      profilePicture: 1
    };
  }

export async function getUserByAuthId(authId: string): Promise<IUserDocument> {
  const users: IUserDocument[] = await UserModel.aggregate([
    { $match: { authId: new mongoose.Types.ObjectId(authId)}},
    { $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId'}},
    { $unwind: '$authId'},
    { $project: aggregateProject()}
  ])
  return users[0]
}

export async function getUserById(userId:string) {
    const users: IUserDocument[] = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId)}},
      { $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId'}},
      { $unwind: '$authId'},
      { $project: aggregateProject()}
    ])
    return users[0]
}
