import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelizeConfig.js";

class User extends Model {}

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

User.sync(); //creeaza tabelul daca nu exista

console.log(User === sequelize.models.User);

export { User };
