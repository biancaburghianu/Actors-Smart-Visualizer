import { statisticsRoute } from "./statisticsRoute.js";

export async function router(req, res) {
  if (req.url.match(/^\/statistics/)) {
    console.log("statistics route");
    statisticsRoute(req, res);
  }
}
