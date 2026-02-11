import { userModel } from "../models/user.model";

/**
 *
 * @param email
 * @returns
 * User Find By Email
 */
export async function findUserByEmail(email: string, password?: string) {
  try {
    if (email && password) {
      const user = await userModel.findOne({ email }).select("+password");
      return user;
    }
    const user = await userModel.findOne({ email });
    return user;
  } catch (error) {
    console.error("Find user by email error: ", error);
    throw new Error("User Find By Email Error!");
  }
}

/**
 * @param {email, name, password}
 * - User create
 */
export async function CreateUser(params: {
  email: string;
  password: string;
  name: string;
}) {
  try {
    const user = await userModel.create(params);
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("User Create Failed!");
  }
}
