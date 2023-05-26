import { GetNominees } from "../controllers/nomineesController.js";
import { Nominalisation } from "../models/models.js";
import sequelize from "sequelize";

const data = await Nominalisation.findAll({
    attributes:[[sequelize.fn('DISTINCT',sequelize.col('year')),'year']],
  });
const json_data = JSON.parse(JSON.stringify(data));

export function nomineesRoute(req,res){
    json_data.forEach(d=>{
        if(d.year!=null){ 
            const year = d.year.substring(0, 4);
            console.log(year + "este anul");
            console.log(json_data)
            
        if(req.url === `/nominees/${year}` && req.method === "GET"){
            GetNominees(d.year,req,res);
        }
    }
    })
    
}