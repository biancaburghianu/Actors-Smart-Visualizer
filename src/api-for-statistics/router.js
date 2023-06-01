import { loginRoute } from "./loginRoute.js";
import { registerRoute } from "./registerRoute.js";
import { statisticsRoute } from "./statisticsRoute.js";
import { nomineesRoute } from "./nomineesRoute.js";

export async function router(req, res) {
  if (req.url.match(/^\/statistics/)) {
    console.log("statistics route");
    statisticsRoute(req, res);
  }
}
