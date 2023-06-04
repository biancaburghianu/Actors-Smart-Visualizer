import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { generateToken } from "./generateToken.js";

dotenv.config();

export function verifyAndRefreshToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Token missing" }));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Hey, the token is valid");
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        const decoded = jwt.decode(token);
        const refreshedToken = generateToken({
          id: decoded.id,
          username: decoded.username,
        });
        res.setHeader("Access-Control-Expose-Headers", "Authorization");
        res.setHeader("Authorization", `Bearer ${refreshedToken}`);
        console.log("Hey, a new token was generated");
        next();
      } catch (error) {
        console.error("Error generating new token:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({ message: "Internal server error" }));
      }
    } else {
      res.statusCode = 401;
      res.end(JSON.stringify({ message: "Invalid token" }));
    }
  }
}
