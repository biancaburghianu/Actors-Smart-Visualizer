import { Nominalisation } from "../models/models.js";
import sequelize from "sequelize";

export async function getBiggestWinners(req, res) {
  const year = "2020 - 26th Annual Screen Actors Guild Awards"; //this is hardcoded from the csv file
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
