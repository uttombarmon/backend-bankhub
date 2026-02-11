import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CreateUser, findUserByEmail } from "../services/auth.service";
import { IUser } from "../models/user.model";

/**
 *
 * @param req
 * @param res
 * - User Registration
 * - api/v1/auth/register
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

/**
 * @param req
 * @param res
 * - User Login
 * - api/v1/auth/login
 */
export async function userLoginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Missing email or password!");
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
