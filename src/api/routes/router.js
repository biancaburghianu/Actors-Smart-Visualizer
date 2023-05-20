import { loginRoute } from "./loginRoute.js";
import { registerRoute } from "./registerRoute.js";
import { statisticsRoute } from "./statisticsRoute.js";

export async function router(req, res) {
  if (req.url.match(/^\/login/)) {
    console.log("login route");
    loginRoute(req, res);
  }
  if (req.url.match(/^\/register/)) {
    console.log("register route");
    registerRoute(req, res);
  }
  if (req.url.match(/^\/statistics/)) {
    console.log("statistics route");
    statisticsRoute(req, res);
  }
  //   if (req.url.match(/^\/nominees/)) {
  //     console.log("nominees route");
  //     nomineesRoute(req, res);
  //   }
}
