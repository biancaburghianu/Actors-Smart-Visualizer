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

export async function getShowByYearNominees(req, res) {
  try {
    const show = await Nominalisation.findOne({
      attributes: [
        "show",
        [sequelize.fn("COUNT", sequelize.col("show")), "count"],
      ],
      where: { won: "False" },
      group: ["show"],
      order: [[sequelize.fn("COUNT", sequelize.col("show")), "DESC"]],
    });

    if (show) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(show));
    } else {
      throw new Error("No show found.");
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
        full_name: { [sequelize.Op.ne]: null } ,
        won: "False"
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
        full_name: { [sequelize.Op.ne]: null } ,
        won: "True"
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
          sequelize.fn("COUNT", sequelize.literal("CASE WHEN won = 'False' THEN 1 END")),
          "FalseCount"
        ],
        [
          sequelize.fn("COUNT", sequelize.literal("CASE WHEN won = 'True' THEN 1 END")),
          "TrueCount"
        ],
        [sequelize.fn("COUNT", sequelize.col("show")), "TotalAppearance"],
      ],
      where: {
        show: {
          [sequelize.Op.ne]: null
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
          sequelize.fn("SUM", sequelize.literal("CASE WHEN won = 'True' THEN 1 ELSE 0 END")),
          "TrueCount"
        ],
        [
          sequelize.fn("SUM", sequelize.literal("CASE WHEN won = 'False' THEN 1 ELSE 0 END")),
          "FalseCount"
        ],
        [
          sequelize.fn("COUNT", sequelize.col("*")),
          "TotalAppearance"
        ],
      ],
      where: {
        full_name: {
          [sequelize.Op.ne]: null
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



