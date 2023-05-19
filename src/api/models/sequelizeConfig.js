import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("AcVis", "postgres", "bianca", {
  host: "localhost",
  dialect: "postgres",
});
