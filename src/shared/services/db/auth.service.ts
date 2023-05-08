import { IAuthDocument } from "@auth/interfaces/auth.interface";
import { AuthModel } from "@auth/models/auth.schema";

async function getUserByUsernameOrEmail (username: string, email: string): Promise<IAuthDocument> {
    const query = {
        $or: [{ username}, {email}]
    }
    const user: IAuthDocument = await AuthModel.findOne(query).exec() as IAuthDocument;
    return user;
}

export default getUserByUsernameOrEmail