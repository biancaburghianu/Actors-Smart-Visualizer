import { loginUser } from "../controllers/loginController.js";

export function loginRoute(req, res) {
  console.log("am ajuns aici ");
  console.log(req.url && req.method);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.url === "/login" && req.method === "POST") {
    console.log("am ajuns");
    loginUser(req, res);
  }
}
