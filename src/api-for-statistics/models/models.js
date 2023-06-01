import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelizeConfig.js";

class User extends Model {}
class Nominalisation extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

Nominalisation.init(
  {
    year: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    full_name: {
      type: DataTypes.STRING,
    },
    show: {
      type: DataTypes.STRING,
    },
    won: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Nominalisation",
    timestamps: false,
  }
);

User.sync(); //creeaza tabelul daca nu exista
Nominalisation.sync();

console.log(User === sequelize.models.User);

export { User, Nominalisation };
