import { IAuthDocument } from "@auth/interfaces/auth.interface";
import { AuthModel } from "@auth/models/auth.schema";

export async function createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data)
}

async function getUserByUsernameOrEmail (username: string, email: string): Promise<IAuthDocument> {
    const query = {
        $or: [{ username}, {email}]
    }
    const user: IAuthDocument = await AuthModel.findOne(query).exec() as IAuthDocument;
    return user;
}

export const getAuthUserByUsername = async (username: string): Promise<IAuthDocument> => {
    const user: IAuthDocument = (await AuthModel.findOne({ username }).exec()) as IAuthDocument;
    return user;
  }


  export const getUserByEmail = async (email: string): Promise<IAuthDocument> => {
    const user: IAuthDocument = (await AuthModel.findOne({ email }).exec()) as IAuthDocument;
    return user;
  }

  export async function updatePasswordToken(authId: string, token: string, tokenExpiration: number): Promise<void> {
    await AuthModel.updateOne({_id: authId}, {
        passwordResetToken: token,
        passwordResetExpires: tokenExpiration
    })
  }

  export async function getAuthUserByToken(token:string) {
      const user: IAuthDocument = ( await AuthModel.findOne({ 
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now()}
      }).exec()) as IAuthDocument; 
      return user;
  }


export default getUserByUsernameOrEmail