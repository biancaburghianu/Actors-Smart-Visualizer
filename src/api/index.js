import { sequelize } from "./models/sequelizeConfig.js";
import { registerUser } from "./controllers/registerUser.js";
import { loginUser } from "./controllers/authUser.js";

import http, { request } from "http";
import url from "url";
import fs from "fs";
import path from "path";
import { Nominalisation } from "./models/models.js";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  console.log(pathname);
  if (req.method === "POST" && req.url === "/register") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const { username, password } = JSON.parse(body);
        console.log(username, password);
        const result = await registerUser(username, password);

        if (result) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: result.message }));
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: result.error }));
        }
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  }
  if (req.url === "/login" && req.method === "POST") {
    console.log("am intrat in if");
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      const { username, password } = JSON.parse(body);
      if (!username && !password) {
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.write("Utilizatorul nu exista");
        res.end();
        return;
      }
      const result = await loginUser(username, password);
      if (!result) {
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.write("Ai gresit numele de utilizator sau parola");
        res.end();
        return;
      }
      const { user, token } = result;
      const tokenString = JSON.stringify({ token: token });
      console.log(user, token);
      res.writeHead(200, {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${token}`,
      });
      res.write("Ai reusit sa te autentifici");
      res.end();
    });
  }
  if (req.method === "GET" && req.url === "/statistics/biggestWinners") {
    const year = "2020 - 26th Annual Screen Actors Guild Awards";
    async function getNominalisations() {
      const nominalisation = await Nominalisation.findAll({
        attributes: [
          "show",
          [sequelize.fn("COUNT", sequelize.col("show")), "count"],
        ],
        where: { won: "True" },
        group: ["show"],
        order: [[sequelize.fn("COUNT", sequelize.col("show")), "DESC"]],
        limit: 10,
      });
      console.log("hei am fost apelat");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(nominalisation));
    }

    getNominalisations().catch((error) => {
      console.error(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    });
  }
});

server.listen(3456, () => {
  console.log("server is listening on port 3456");
});
