import { sequelize } from "./sequelizeConfig.js";
import { registerUser } from "./registerUser.js";
import { loginUser } from "./authUser.js";

import http from "http";
import url from "url";
import fs from "fs";
import path from "path";

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

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
  } else if (parsedUrl.pathname === "/register" && req.method === "GET") {
    fs.readFile("../../public/register.html", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading register.html");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (parsedUrl.pathname === "/login" && req.method === "GET") {
    fs.readFile("../../public/login.html", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading login.html");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (parsedUrl.pathname === "/login.css") {
    fs.readFile("../../public/login.css", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading style.css");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(data);
    });
  } else if (parsedUrl.pathname === "/loginBackground.jpeg") {
    fs.readFile("../../public/loginBackground.jpeg", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading style.css");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/jpeg" });
      res.end(data);
    });
  } else if (req.url === "/login" && req.method === "POST") {
    console.log("am intrat in if");
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      const { username, password } = JSON.parse(body);
      //   if (!username && !password) {
      //     res.writeHead(401, { "Content-Type": "text/plain" });
      //     res.write("Utilizatorul nu exista");
      //     res.end();
      //     return;
      //   }
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
  } else if (parsedUrl.pathname === "/home" && req.method === "GET") {
    fs.readFile("../../public/home.html", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading home.html");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
      console.log(data);
    });
  } else if (parsedUrl.pathname === "/home.css") {
    fs.readFile("../../public/home.css", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading style.css");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(data);
    });
  } else if (parsedUrl.pathname === "/Untitled.png") {
    fs.readFile("../../public/Untitled.png", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading style.css");
        return;
      }
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  } else if (parsedUrl.pathname === "/Logo.png") {
    fs.readFile("../../public/Logo.png", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading style.css");
        return;
      }
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  } else if (req.method === "POST" && req.url === "/register") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const { username, password } = JSON.parse(body);
        console.log(username, password);
        const result = await registerUser(username, password);

        if (result.success) {
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
});

server.listen(3456, () => {
  console.log("server is listening on port 3456");
});
