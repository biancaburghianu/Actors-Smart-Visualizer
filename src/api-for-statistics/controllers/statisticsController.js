import { Nominalisation } from "../models/models.js";
import sequelize from "sequelize";

export async function getBiggestWinners(req, res) {
  try {
    const nominalisation = await Nominalisation.findAll({
      attributes: [
        "show",
        [sequelize.fn("COUNT", sequelize.col("show")), "count"],
      ],
      where: { won: "True" },
      group: ["show"],
      order: [[sequelize.fn("COUNT", sequelize.col("show")), "DESC"]],
      limit: 10,
    });

    if (nominalisation) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(nominalisation));
    } else throw new Error("Nu exista nominalizari");
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}
export async function getBiggestNominees(req, res) {
  try {
    const shows = await Nominalisation.findAll({
      attributes: [
        "show",
        [sequelize.fn("COUNT", sequelize.col("show")), "count"],
      ],
      where: { won: "False" },
      group: ["show"],
      order: [[sequelize.fn("COUNT", sequelize.col("show")), "DESC"]],
      limit: 10,
    });

    if (shows) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(shows));
    } else {
      throw new Error("No shows found.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function getMostNominatedPeople(req, res) {
  try {
    const people = await Nominalisation.findAll({
      attributes: [
        "full_name",
        [sequelize.fn("COUNT", sequelize.col("full_name")), "count"],
      ],
      where: {
        full_name: { [sequelize.Op.ne]: null },
        won: "False",
      },
      group: ["full_name"],
      order: [[sequelize.fn("COUNT", sequelize.col("full_name")), "DESC"]],
      limit: 10,
    });

    if (people) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(people));
    } else {
      throw new Error("No people found.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function getPeopleWithMostStatues(req, res) {
  try {
    const people = await Nominalisation.findAll({
      attributes: [
        "full_name",
        [sequelize.fn("COUNT", sequelize.col("full_name")), "count"],
      ],
      where: {
        full_name: { [sequelize.Op.ne]: null },
        won: "True",
      },
      group: ["full_name"],
      order: [[sequelize.fn("COUNT", sequelize.col("full_name")), "DESC"]],
      limit: 10,
    });

    if (people) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(people));
    } else {
      throw new Error("No people found.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function getMostAppearedShows(req, res) {
  try {
    const shows = await Nominalisation.findAll({
      attributes: [
        "show",
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN won = 'False' THEN 1 END")
          ),
          "FalseCount",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal("CASE WHEN won = 'True' THEN 1 END")
          ),
          "TrueCount",
        ],
        [sequelize.fn("COUNT", sequelize.col("show")), "TotalAppearance"],
      ],
      where: {
        show: {
          [sequelize.Op.ne]: null,
        },
      },
      group: ["show"],
      order: [[sequelize.literal("COUNT(*)"), "DESC"]],
      limit: 10,
    });

    if (shows) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(shows));
    } else {
      throw new Error("No shows found.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function getMostAppearedPeople(req, res) {
  try {
    const people = await Nominalisation.findAll({
      attributes: [
        "full_name",
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN won = 'True' THEN 1 ELSE 0 END")
          ),
          "TrueCount",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN won = 'False' THEN 1 ELSE 0 END")
          ),
          "FalseCount",
        ],
        [sequelize.fn("COUNT", sequelize.col("*")), "TotalAppearance"],
      ],
      where: {
        full_name: {
          [sequelize.Op.ne]: null,
        },
      },
      group: ["full_name"],
      order: [[sequelize.literal("COUNT(*)"), "DESC"]],
      limit: 10,
    });

    if (people) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(people));
    } else {
      throw new Error("No people found.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function getMostAppearedCategories(req, res) {
  try {
    const categories = await Nominalisation.findAll({
      attributes: [
        "category",
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN won = 'True' THEN 1 ELSE 0 END")
          ),
          "TrueCount",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN won = 'False' THEN 1 ELSE 0 END")
          ),
          "FalseCount",
        ],
        [sequelize.fn("COUNT", sequelize.col("*")), "TotalAppearance"],
      ],
      where: {
        category: {
          [sequelize.Op.ne]: null,
        },
      },
      group: ["category"],
      order: [[sequelize.literal("COUNT(*)"), "DESC"]],
      limit: 10,
    });

    if (categories) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(categories));
    } else {
      throw new Error("No categories found.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

import { Op } from "sequelize";

export async function getActorActressProportions(req, res) {
  try {
    const actorActressData = await Nominalisation.findAll({
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("category")), "count"],
      ],
      where: {
        [Op.or]: [
          { category: { [Op.like]: "MALE%" } },
          { category: { [Op.like]: "FEMALE%" } },
        ],
      },
      group: ["category"],
    });

    if (actorActressData) {
      const data = actorActressData.map((item) => ({
        category: item.category.includes("FEMALE") ? "Actor" : "Actress",
        count: item.get("count"),
      }));

      const actorCount =
        data.find((item) => item.category === "Actor")?.count || 0;
      const actressCount =
        data.find((item) => item.category === "Actress")?.count || 0;
      const totalCount = actorCount + actressCount;

      const actorProportion = actorCount / totalCount;
      const actressProportion = actressCount / totalCount;

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ data, actorProportion, actressProportion }));
    } else {
      throw new Error("No actor or actress data found");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function getShowByYearNominees(req, res) {
  try {
    const nominees = await Nominalisation.findAll({
      attributes: [
        [
          sequelize.fn(
            "DISTINCT",
            sequelize.fn("SUBSTRING", sequelize.col("year"), 1, 4)
          ),
          "year",
        ],
        "show",
        [sequelize.fn("COUNT", sequelize.col("show")), "count"],
      ],
      where: {
        show: {
          [Op.ne]: "N/A",
        },
        won: "False",
      },
      group: ["year", "show"],
      order: [
        ["year", "ASC"],
        [sequelize.fn("COUNT", sequelize.col("show")), "DESC"],
      ],
    });

    if (nominees) {
      const years = [...new Set(nominees.map((item) => item.dataValues.year))];
      const showsYear = years.map((year) =>
        nominees.find((item) => item.dataValues.year === year)
      );

      const filteredNominees = showsYear.filter(
        (item) => item.dataValues.year !== null
      );

      const processedNominees = filteredNominees.map((item) => ({
        year: item.dataValues.year,
        show: item.dataValues.show,
        count: item.dataValues.count,
      }));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(processedNominees));
    } else {
      throw new Error("No nominees found.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function getShowByYearWinners(req, res) {
  try {
    const nominees = await Nominalisation.findAll({
      attributes: [
        [
          sequelize.fn(
            "DISTINCT",
            sequelize.fn("SUBSTRING", sequelize.col("year"), 1, 4)
          ),
          "year",
        ],
        "show",
        [sequelize.fn("COUNT", sequelize.col("show")), "count"],
      ],
      where: {
        show: {
          [Op.ne]: "N/A",
        },
        won: "True",
      },
      group: ["year", "show"],
      order: [
        ["year", "ASC"],
        [sequelize.fn("COUNT", sequelize.col("show")), "DESC"],
      ],
    });

    if (nominees) {
      const years = [...new Set(nominees.map((item) => item.dataValues.year))];
      const showsYear = years.map((year) =>
        nominees.find((item) => item.dataValues.year === year)
      );

      const filteredNominees = showsYear.filter(
        (item) => item.dataValues.year !== null
      );

      const processedNominees = filteredNominees.map((item) => ({
        year: item.dataValues.year,
        show: item.dataValues.show,
        count: item.dataValues.count,
      }));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(processedNominees));
    } else {
      throw new Error("No nominees found.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function getPeopleByYearNominees(req, res) {
  try {
    const nominees = await Nominalisation.findAll({
      attributes: [
        [
          sequelize.fn(
            "DISTINCT",
            sequelize.fn("SUBSTRING", sequelize.col("year"), 1, 4)
          ),
          "year",
        ],
        "full_name",
        [sequelize.fn("COUNT", sequelize.col("full_name")), "count"],
      ],
      where: {
        full_name: {
          [Op.ne]: null,
        },
        won: "False",
      },
      group: ["year", "full_name"],
      order: [
        ["year", "ASC"],
        [sequelize.fn("COUNT", sequelize.col("full_name")), "DESC"],
      ],
    });

    if (nominees) {
      const years = [...new Set(nominees.map((item) => item.dataValues.year))];
      const showsYear = years.map((year) =>
        nominees.find((item) => item.dataValues.year === year)
      );

      const filteredNominees = showsYear.filter(
        (item) => item.dataValues.year !== null
      );

      const processedNominees = filteredNominees.map((item) => ({
        year: item.dataValues.year,
        full_name: item.dataValues.full_name,
        count: item.dataValues.count,
      }));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(processedNominees));
    } else {
      throw new Error("No nominees found.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function getPeopleByYearWinners(req, res) {
  try {
    const nominees = await Nominalisation.findAll({
      attributes: [
        [
          sequelize.fn(
            "DISTINCT",
            sequelize.fn("SUBSTRING", sequelize.col("year"), 1, 4)
          ),
          "year",
        ],
        "full_name",
        [sequelize.fn("COUNT", sequelize.col("full_name")), "count"],
      ],
      where: {
        full_name: {
          [Op.ne]: null,
        },
        won: "True",
      },
      group: ["year", "full_name"],
      order: [
        ["year", "ASC"],
        [sequelize.fn("COUNT", sequelize.col("full_name")), "DESC"],
      ],
    });

    if (nominees) {
      const years = [...new Set(nominees.map((item) => item.dataValues.year))];
      const showsYear = years.map((year) =>
        nominees.find((item) => item.dataValues.year === year)
      );

      const filteredNominees = showsYear.filter(
        (item) => item.dataValues.year !== null
      );

      const processedNominees = filteredNominees.map((item) => ({
        year: item.dataValues.year,
        full_name: item.dataValues.full_name,
        count: item.dataValues.count,
      }));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(processedNominees));
    } else {
      throw new Error("No nominees found.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function getWinning(req, res) {
  try {
    const winners = await Nominalisation.findAll({
      attributes: [
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(`CASE WHEN won = 'False' THEN 1 ELSE 0 END`)
          ),
          "falseCount",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(`CASE WHEN won = 'True' THEN 1 ELSE 0 END`)
          ),
          "trueCount",
        ],
      ],
    });

    if (winners) {
      const falseCount = winners[0].dataValues.falseCount;
      const trueCount = winners[0].dataValues.trueCount;

      const winningData = {
        falseCount: falseCount,
        trueCount: trueCount,
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(winningData));
    } else {
      throw new Error("No winners found.");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}
export async function getActorsByYear(year, gender, won, req, res) {
  try {
    console.log("Received data from client:");
    console.log("Year:", year);
    console.log("Gender:", gender);
    console.log("Won:", won);

    // Build the conditions based on the received data
    const whereClause = {
      full_name: {
        [Op.not]: null,
      },
      won: won.charAt(0).toUpperCase() + won.slice(1),
    };

    if (year) {
      whereClause.year = {
        [Op.like]: `${year}%`,
      };
    }

    if (gender && gender.toLowerCase() !== "all") {
      whereClause.category = {
        [Op.like]: `%${gender.toUpperCase()} %`,
      };
    }

    // Perform the database query to retrieve the count of won values
    const actors = await Nominalisation.findAll({
      attributes: ["full_name", [sequelize.fn("COUNT", sequelize.col("won")), "won_count"]],
      where: whereClause,
      group: ["full_name"],
    });

    // Prepare the response data
    const responseData = actors.map((actor) => ({
      full_name: actor.dataValues.full_name,
      won_count: actor.dataValues.won_count,
    }));

    // Send the response
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(responseData));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function getWinnerByCategory(category, won, req, res) {
  try {
    console.log("Received data from client:");
    console.log("Category:", category);
    console.log("Won:", won);

    const decodedCategory = decodeURIComponent(category);

    // Build the conditions based on the received data
    const whereClause = {
      category: {
        [Op.like]: `%${decodedCategory.toUpperCase()}%`,
      },
    };

    if (typeof won !== "undefined") {
      whereClause.won = won.charAt(0).toUpperCase() + won.slice(1);
    }

    // Perform the database query to retrieve the winners or losers for the specific category
    const results = await Nominalisation.findAll({
      attributes: [
        [
          sequelize.literal('CASE WHEN full_name IS NULL THEN "show" ELSE full_name END'),
          "value",
        ],
        [sequelize.fn("COUNT", sequelize.literal("won")), "count"],
        [sequelize.literal('SUBSTRING(year, 1, 4)'), 'year'],
      ],
      where: whereClause,
      limit: 20,
      group: ["value", "year"],
    });

    // Prepare the response data
    const responseData = results.map((result) => ({
      value: result.dataValues.value,
      count: result.dataValues.count,
      year: result.dataValues.year,
    }));

    // Send the response
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(responseData));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}
