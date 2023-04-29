import bcrypt from "bcrypt";
import { generateToken } from "./generateToken.js";
import { User } from "./models.js";

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
