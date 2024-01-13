import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'
import cors from "cors";
import jwt  from "jsonwebtoken";
//updated index.html
// import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Routes
const app = express();
app.use(cors());

dotenv.config();

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const middleware=async (req,res,next)=>{
let token=req.headers['authorization'];
if(token){
 token=token.split(' ')[1];
 await jwt.verify(token, 'shhhhh',(err,valid)=>{
    if(err){
      res.status(401).send({result:"please provide valid token"});
    }
    else{
      next();
    }
  });
}
else{
  res.status(403).send({result:"please send token"});
}  
}



  // usage of routes
  app.use('/auth', AuthRoute)
  app.use('/user',middleware, UserRoute)
  app.use('/post',middleware, PostRoute)

  app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "frontend", "build")));
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    });
    

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Listening at ${process.env.PORT}`)
    )
  )
  .catch((error) => console.log(error));
