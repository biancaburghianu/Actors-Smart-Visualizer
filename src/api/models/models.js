import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelizeConfig.js";

class User extends Model {}
class Nominalisation extends Model {}
class FavoriteStatistic extends Model {}
class FavoriteNominee extends Model {}
class FavoriteArticle extends Model {}

User.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.INTEGER,
    },
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

FavoriteArticle.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    details: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    modelName: "FavoriteArticle",
    timestamps: false,
  }
);

User.hasOne(FavoriteArticle, {
  foreignKey: "userId",
});

FavoriteArticle.belongsTo(User, {
  foreignKey: "userId",
});

User.sync(); //creeaza tabelul daca nu exista
Nominalisation.sync();
FavoriteArticle.sync();

console.log(User === sequelize.models.User);

export { User, Nominalisation };
