import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CreateUser, findUserByEmail } from "../services/auth.service";
import { IUser } from "../types/User";

/**
 *
 * @param req
 * @param res
 * - User Registration
 * - api/v1/auth/registration
 */
export async function userRegisterController(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new Error("Missing email or name or password!");
  }
  const exitUser = await findUserByEmail(email);
  if (exitUser) {
    throw new Error("User already exits!");
  }
  const user = await CreateUser({ name, email, password });
  const userObject = user.toObject() as IUser;
  delete userObject.password;
  const payload = { email: userObject.email, id: userObject._id };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  res.cookie("token", token);
  res.status(201).json({
    token,
    success: true,
    user: userObject,
  });
}
