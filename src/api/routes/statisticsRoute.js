import { getBiggestWinners , getBiggestNominees,getShowByYearNominees,getMostNominatedPeople ,getPeopleWithMostStatues,getMostAppearedShows,getMostAppearedPeople} from "../controllers/statisticsController.js";

export function statisticsRoute(req, res) {
  if (req.url === "/statistics/biggestWinners" && req.method === "GET") {
    getBiggestWinners(req, res);
  }
  else if (req.url === "/statistics/biggestNominees" && req.method === "GET") {
    getBiggestNominees(req, res);
  }
  else if (req.url === "/statistics/showByYearNominees" && req.method === "GET") {
    getShowByYearNominees(req, res);
  }
  else if (req.url === "/statistics/mostNominatedPeople" && req.method === "GET") {
    getMostNominatedPeople(req, res);
  }
  else if (req.url === "/statistics/peopleWithMostStatues" && req.method === "GET") {
    getPeopleWithMostStatues(req, res);
  }
  else if (req.url === "/statistics/mostAppearedShows" && req.method === "GET") {
    getMostAppearedShows(req, res);
  }
  else if (req.url === "/statistics/mostAppearedPeople" && req.method === "GET") {
    getMostAppearedPeople(req, res);
  }
 
}



