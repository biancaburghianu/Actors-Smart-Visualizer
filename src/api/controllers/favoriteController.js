import jwt from "jsonwebtoken";
import { FavoriteArticle, User } from "../models/models.js"; 
import dotenv from 'dotenv';
dotenv.config()

export async function addFavoriteArticle(req, res) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];
  
      if (!token) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return;
      }
  
    
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
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
            const favoriteArticleData = JSON.parse(body);

            const userFavoriteExists=await FavoriteArticle.findOne({ 
                where:{
                    userId:user.id
                }
            })
            if(userFavoriteExists){
                await userFavoriteExists.update({details: favoriteArticleData});
                res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "Favorite article updated succesfully" }));
            }
            else{
  
          const favoriteArticle = await FavoriteArticle.create({
            userId: user.id,
            details: favoriteArticleData,
          });
  
          console.log("Favorite article added:", favoriteArticle);
  
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "Favorite article added successfully" }));
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