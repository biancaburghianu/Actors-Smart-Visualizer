import jwt from "jsonwebtoken";
import {
  FavoriteArticle,
  User,
  FavoriteNominee,
  FavoriteStatistic,
} from "../models/models.js";
import { generateToken } from "../utils/generateToken.js";
import dotenv from "dotenv";
dotenv.config();

export async function addFavoriteArticle(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        try {
          const decoded = jwt.decode(token);
          const refreshedToken = generateToken({
            id: decoded.id,
            username: decoded.username,
          });
          res.setHeader("Access-Control-Expose-Headers", "Authorization");
          res.setHeader("Authorization", `Bearer ${refreshedToken}`);
          console.log("Hey, a new token was generated in addFavoriteArticle");
          decodedToken = jwt.verify(refreshedToken, process.env.JWT_SECRET);
        } catch (error) {
          console.error("Error generating new token:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Internal server error" }));
          return;
        }
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid token" }));
        return;
      }
    }

    const userId = parseInt(decodedToken.id);

    const user = await User.findByPk(userId);

    if (!user) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const favoriteArticleData = JSON.parse(body);

        const userFavoriteExists = await FavoriteArticle.findOne({
          where: {
            userId: user.id,
          },
        });

        if (userFavoriteExists) {
          await userFavoriteExists.update({ details: favoriteArticleData });
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ message: "Favorite article updated successfully" })
          );
        } else {
          const favoriteArticle = await FavoriteArticle.create({
            userId: user.id,
            details: favoriteArticleData,
          });

          console.log("Favorite article added:", favoriteArticle);

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ message: "Favorite article added successfully" })
          );
        }
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Bad request" }));
      }
    });
  } catch (error) {
    console.error("Error adding favorite article:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

export async function getFavoriteArticle(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        try {
          const decoded = jwt.decode(token);
          const refreshedToken = generateToken({
            id: decoded.id,
            username: decoded.username,
          });
          res.setHeader("Access-Control-Expose-Headers", "Authorization");
          res.setHeader("Authorization", `Bearer ${refreshedToken}`);
          console.log("Hey, a new token was generated in  getFavoriteArticle");
          decodedToken = jwt.verify(refreshedToken, process.env.JWT_SECRET);
        } catch (error) {
          console.error("Error generating new token:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Internal server error" }));
          return;
        }
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid token" }));
        return;
      }
    }

    const userId = parseInt(decodedToken.id);

    const user = await User.findByPk(userId);

    if (!user) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    const favoriteArticle = await FavoriteArticle.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!favoriteArticle) {
      res.statusCode = 404;
      res.end(
        JSON.stringify({ error: "The user doesn't have a favorite article" })
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ favoriteArticle }));
  } catch (error) {
    console.error("Error getting favorite article:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}
export async function addFavoriteNominee(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        try {
          const decoded = jwt.decode(token);
          const refreshedToken = generateToken({
            id: decoded.id,
            username: decoded.username,
          });
          res.setHeader("Access-Control-Expose-Headers", "Authorization");
          res.setHeader("Authorization", `Bearer ${refreshedToken}`);
          console.log("Hey, a new token was generated in addFavoriteNominee");
          decodedToken = jwt.verify(refreshedToken, process.env.JWT_SECRET);
        } catch (error) {
          console.error("Error generating new token:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Internal server error" }));
          return;
        }
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid token" }));
        return;
      }
    }

    const userId = parseInt(decodedToken.id);

    console.log(userId);

    const user = await User.findByPk(userId);

    if (!user) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const favoriteNomineeName = JSON.parse(body);

        const userFavoriteExists = await FavoriteNominee.findOne({
          where: {
            userId: user.id,
          },
        });

        if (userFavoriteExists) {
          await userFavoriteExists.update({ nomineeName: favoriteNomineeName });
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ message: "Favorite nominee updated successfully" })
          );
        } else {
          const favoriteNominee = await FavoriteNominee.create({
            userId: user.id,
            nomineeName: favoriteNomineeName,
          });

          console.log("Favorite nominee added:", favoriteNominee);

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ message: "Favorite nominee added successfully" })
          );
        }
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Bad request" }));
      }
    });
  } catch (error) {
    console.error("Error adding favorite nominee:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

export async function getFavoriteNominee(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        try {
          const decoded = jwt.decode(token);
          const refreshedToken = generateToken({
            id: decoded.id,
            username: decoded.username,
          });
          res.setHeader("Access-Control-Expose-Headers", "Authorization");
          res.setHeader("Authorization", `Bearer ${refreshedToken}`);
          console.log("Hey, a new token was generated in getFavoriteNominee");
          decodedToken = jwt.verify(refreshedToken, process.env.JWT_SECRET);
        } catch (error) {
          console.error("Error generating new token:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Internal server error" }));
          return;
        }
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid token" }));
        return;
      }
    }

    const userId = parseInt(decodedToken.id);

    const user = await User.findByPk(userId);

    if (!user) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    const favoriteNominee = await FavoriteNominee.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!favoriteNominee) {
      res.statusCode = 404;
      res.end(
        JSON.stringify({ error: "The user doesn't have a favorite nominee" })
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ favoriteNominee }));
  } catch (error) {
    console.error("Error getting favorite nominee:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

export async function addFavoriteStatistic(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        try {
          const decoded = jwt.decode(token);
          const refreshedToken = generateToken({
            id: decoded.id,
            username: decoded.username,
          });
          res.setHeader("Access-Control-Expose-Headers", "Authorization");
          res.setHeader("Authorization", `Bearer ${refreshedToken}`);
          console.log("Hey, a new token was generated in addFavoriteStatistic");
          decodedToken = jwt.verify(refreshedToken, process.env.JWT_SECRET);
        } catch (error) {
          console.error("Error generating new token:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Internal server error" }));
          return;
        }
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid token" }));
        return;
      }
    }

    const userId = parseInt(decodedToken.id);

    const user = await User.findByPk(userId);

    if (!user) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const favoriteStatisticData = JSON.parse(body);
        console.log(body, 1234);

        const userFavoriteExists = await FavoriteStatistic.findOne({
          where: {
            userId: user.id,
          },
        });

        if (userFavoriteExists) {
          await userFavoriteExists.update({
            statisticName: favoriteStatisticData.title,
          });
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              message: "Favorite statistic updated successfully",
            })
          );
        } else {
          const favoriteStatistic = await FavoriteStatistic.create({
            userId: user.id,
            statisticName: favoriteStatisticData.title,
          });

          console.log("Favorite statistic added:", favoriteStatistic);

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ message: "Favorite statistic added successfully" })
          );
        }
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Bad request" }));
      }
    });
  } catch (error) {
    console.error("Error adding favorite statistic:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

export async function getFavoriteStatistic(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        try {
          const decoded = jwt.decode(token);
          const refreshedToken = generateToken({
            id: decoded.id,
            username: decoded.username,
          });
          res.setHeader("Access-Control-Expose-Headers", "Authorization");
          res.setHeader("Authorization", `Bearer ${refreshedToken}`);
          console.log("Hey, a new token was generated in favorite controller");
          decodedToken = jwt.verify(refreshedToken, process.env.JWT_SECRET);
        } catch (error) {
          console.error("Error generating new token:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Internal server error" }));
          return;
        }
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid token" }));
        return;
      }
    }

    const userId = parseInt(decodedToken.id);

    const user = await User.findByPk(userId);

    if (!user) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    const favoriteStatistic = await FavoriteStatistic.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!favoriteStatistic) {
      res.statusCode = 404;
      res.end(
        JSON.stringify({ error: "The user doesn't have a favorite statistic" })
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ favoriteStatistic }));
  } catch (error) {
    console.error("Error getting favorite statistic:", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}
