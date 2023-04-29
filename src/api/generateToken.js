import jwt from "jsonwebtoken";

export function generateToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    "AcVis",
    { expiresIn: "1h" }
  );
  return token;
}
