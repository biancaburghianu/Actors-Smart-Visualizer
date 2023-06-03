import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { generateToken } from "./generateToken.js";

dotenv.config();

export function verifyAndRefreshToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  const excludedRoutes = ["/login", "/register", "/changePassword"];

  if (excludedRoutes.includes(req.url)) {
    next();
    return;
  }

  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Token missing" }));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp <= currentTimestamp) {
      const refreshedToken = generateToken({
        id: decoded.id,
        username: decoded.username,
      });
      console.log("s-a generat noul token", refreshedToken);

      res.setHeader("Authorization", `Bearer ${refreshedToken}`);
    }

    next();
  } catch (error) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Invalid token" }));
  }
}
