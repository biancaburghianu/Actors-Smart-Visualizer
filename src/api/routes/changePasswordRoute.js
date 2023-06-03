import { changePassword } from "../controllers/changePasswordController.js";

export function changePasswordRoute(req, res) {
  if (req.url.match(/^\/changePassword/) && req.method === "PATCH") {
    console.log("changePasswordRoute route");
    changePassword(req, res);
  }
}
