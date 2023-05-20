import { getBiggestWinners } from "../controllers/statisticsController.js";

export function statisticsRoute(req, res) {
  if (req.url === "/statistics/biggestWinners" && req.method === "GET") {
    getBiggestWinners(req, res);
  }
}
