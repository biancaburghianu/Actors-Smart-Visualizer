import NewsAPI from "newsapi";
import dotenv from "dotenv";
import querystring from "querystring";
import url from "url";

dotenv.config();

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

export function getArticles(req, res) {
  const parsed = url.parse(req.url);
  const query = querystring.parse(parsed.query);

  if (query.search) {
    newsapi.v2
      .everything({
        q: query.search,
        language: "en",
        sortBy: "relevancy",
      })
      .then((response) => {
        console.log(response);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      })
      .catch((error) => {
        console.error(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "A apărut o problemă la căutare." }));
      });
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Cuvântul cheie lipsește din cerere." }));
  }
}
