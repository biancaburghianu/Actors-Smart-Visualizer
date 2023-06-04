import {
  addFavoriteArticle,
  addFavoriteNominee,
  getFavoriteArticle,
  getFavoriteNominee,
  addFavoriteStatistic,
  getFavoriteStatistic
} from "../controllers/favoriteController.js";

export function favoritesRoute(req, res) {
  if (req.url.match(/^\/favorite\/article/) && req.method === "GET") {
    console.log("favorite/article route");
    getFavoriteArticle(req, res);
  } else if (req.url.match(/^\/favorite\/article/) && req.method === "POST") {
    console.log("favorite/article route");
    addFavoriteArticle(req, res);
  } else if (req.url.match(/^\/favorite\/nominee/) && req.method === "GET") {
    console.log("favorite/nominee route");
    getFavoriteNominee(req, res);
  } else if (req.url.match(/^\/favorite\/nominee/) && req.method === "POST") {
    console.log("favorite/nominee route");
    addFavoriteNominee(req, res);
  }
  else if (req.url.match(/^\/favorite\/statistics/) && req.method === "GET") {
    console.log("favorite/statistic route");
    getFavoriteStatistic(req, res);
  } else if (
    req.url.match(/^\/favorite\/statistics/) &&
    req.method === "POST"
  ) {
    console.log("favorite/statistic route");
    addFavoriteStatistic(req, res);
  }
}

