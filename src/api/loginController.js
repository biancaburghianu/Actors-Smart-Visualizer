import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { User } from "../models/models.js";

export async function loginUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    const { username, password } = JSON.parse(body);
    console.log(username, password);

    if (!username && !password) {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.write("Utilizatorul nu exista");
      res.end();
    }
    const user = await User.findOne({
      where: { username: username },
    });

    if (!user) {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.write("Ai gresit numele de utilizator sau parola");
      res.end();
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.write("Ai gresit numele de utilizator sau parola");
      res.end();
      return;
    }

    const token = generateToken(user);
    const tokenString = JSON.stringify({ token: token });
    console.log(user, token);
    res.setHeader("Access-Control-Expose-Headers", "Authorization");
    res.writeHead(200, {
      "Content-Type": "text/plain",
      Authorization: `Bearer ${token}`,
    });
    res.write("Ai reusit sa te autentifici");
    res.end();
  });
}
