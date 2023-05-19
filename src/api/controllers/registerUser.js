import bcrypt from "bcrypt";
import { User } from "../models/models.js";

export async function registerUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: username,
    password: hashedPassword,
  });

  return user;
}
