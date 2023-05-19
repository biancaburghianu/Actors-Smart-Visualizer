import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { User } from "../models/models.js";

export async function loginUser(username, password) {
  const user = await User.findOne({
    where: { username: username },
  });

  if (!user) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return null;
  }

  const token = generateToken(user);

  return { user, token };
}
//AR TREBUI IMPLEMENTAT UN FIND ALL, SAU LASAM USERNAME UL UNIC?
