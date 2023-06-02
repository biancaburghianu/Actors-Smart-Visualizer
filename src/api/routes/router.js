import { loginRoute } from "./loginRoute.js";
import { registerRoute } from "./registerRoute.js";
import { statisticsRoute } from "./statisticsRoute.js";
import { nomineesRoute } from "./nomineesRoute.js";
import { articlesRoute } from "./articlesRoute.js";

export async function router(req, res) {
  if (req.url.match(/^\/login/)) {
    console.log("login route");
    loginRoute(req, res);
  } else if (req.url.match(/^\/register/)) {
    console.log("register route");
    registerRoute(req, res);
  } else if (req.url.match(/^\/statistics/)) {
    console.log("statistics route");
    statisticsRoute(req, res);
  } else if (req.url.match(/^\/nominees/)) {
    console.log("nominees route");
    nomineesRoute(req, res);
  } else if (req.url.match(/^\/articles/)) {
    console.log("articles route");
    articlesRoute(req, res);
  } else if (req.url.match(/^\/favorite\//)) {
    console.log("favorite route");
    favoritesRoute(req, res);
  }
}
