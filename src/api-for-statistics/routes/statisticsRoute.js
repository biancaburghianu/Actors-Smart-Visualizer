import { getBiggestWinners , getBiggestNominees,getShowByYearNominees,getMostNominatedPeople ,
  getPeopleWithMostStatues,getMostAppearedShows,getMostAppearedPeople,getMostAppearedCategories,
  getActorActressProportions,getShowByYearWinners,getPeopleByYearNominees,getPeopleByYearWinners,getWinning,getActorsByYear,getWinnerByCategory
} from "../controllers/statisticsController.js";

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
  }else if (req.url === "/statistics/mostAppearedCategories" && req.method === "GET") {
    getMostAppearedCategories(req, res);
  }else if (req.url === "/statistics/actorActressProportions" && req.method === "GET") {
    getActorActressProportions(req, res);
  }
  else if (req.url === "/statistics/showByYearWinners" && req.method === "GET") {
    getShowByYearWinners(req, res);
  }else if (req.url === "/statistics/peopleByYearNominees" && req.method === "GET") {
    getPeopleByYearNominees(req, res);
  }
  else if (req.url === "/statistics/peopleByYearWinners" && req.method === "GET") {
    getPeopleByYearWinners(req, res);
  }else if (req.url === "/statistics/winning" && req.method === "GET") {
    getWinning(req, res);
  }else if (req.url.startsWith("/statistics/actorsByYear/") && req.method === "GET") {
    const urlParts = req.url.split("/");
    const year = urlParts[3];
    const gender = urlParts[4];
    const won = urlParts[5];
    getActorsByYear(year, gender, won, req, res);
  }else if (req.url.startsWith("/statistics/winnersByCategory/") && req.method === "GET") {
    const urlParts = req.url.split("/");
    const category = urlParts[3];
    const won = urlParts[4];
    getWinnerByCategory(category,won, req, res);
  }

}



