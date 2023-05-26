import { Nominalisation } from "../models/models.js";
import sequelize from "sequelize";

export async function GetNominees(year,req,res){
    try {
        const nominalisation = await Nominalisation.findAll({
          attributes:{exclude:['id']},
          where: { year:year }
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