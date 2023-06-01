import { getArticles } from "../controllers/articlesController.js";

export function articlesRoute(req, res) {
  if (req.url.match(/^\/articles/) && req.method === "GET") {
    getArticles(req, res);
  }
}
