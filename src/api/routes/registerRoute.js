import { registerUser } from "../controllers/registerController.js";

export function registerRoute(req, res) {
  if (req.url === "/register" && req.method === "POST") {
    registerUser(req, res);
  }
}
