import fs from "fs";
import jwt from "jsonwebtoken";

export function writeDataToFile(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
}

export function getPostData(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        resolve(body);
      });
    } catch (err) {
      reject(err);
    }
  });
}

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
