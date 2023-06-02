import bcrypt from "bcrypt";
import { User } from "../models/models.js";

export async function registerUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    try {
      const { username, password } = JSON.parse(body);


      const userExists = await User.findOne({
        where: {
          username: username,
        },
      });
      if (userExists) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Numele de utilizator deja exista. Incearca altul",
          })
        );
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username: username,
        password: hashedPassword,
      });
      console.log(username);
      if (user) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message:
              "Contul a fost creat cu succes, intoarce-te la pagina de Login pentru autentificare",
          })
        );
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "S-a produs o eroare la crearea contului" })
        );
      }
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
}
