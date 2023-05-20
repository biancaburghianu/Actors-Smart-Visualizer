import { loginUser } from "../controllers/loginController.js";

export function loginRoute(req, res) {
  if (req.url === "/login" && req.method === "POST") {
    loginUser(req, res);
  }
}
