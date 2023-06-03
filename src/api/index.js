import http from "http";
import dotenv from "dotenv";
import { router } from "./routes/router.js";
import cors from "cors";
import { verifyAndRefreshToken } from "./utils/verifyAndRefreshToken.js";

dotenv.config();

const server = http.createServer((req, res) => {
  const corsOptions = {
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH",
    allowedHeaders: "*",
  };
  cors(corsOptions)(req, res, () => {
    verifyAndRefreshToken(req, res, () => {
      router(req, res);
    });
  });
});

server.listen(process.env.PORT, () =>
  console.log(`[server] Server running on port ${process.env.PORT}`)
);
