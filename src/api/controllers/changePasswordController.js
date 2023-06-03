import bcrypt from "bcrypt";
import { User } from "../models/models.js";

export async function changePassword(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    try {
      const { username, favorite, newPassword } = JSON.parse(body);

      const user = await User.findOne({
        where: {
          username: username,
        },
      });

      if (!user) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Username-ul nu e corect",
          })
        );
        return;
      }

      const isCredentialsValid = await bcrypt.compare(favorite, user.favorite);
      console.log(user.favorite);
      console.log(isCredentialsValid);
      console.log(typeof favorite);
      if (!isCredentialsValid) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message:
              "Numele actritei/actorului/serialului/filmului preferat nu e corect",
          })
        );
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await user.update({ password: hashedPassword });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Parola a fost actualizata cu succes",
        })
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
}
