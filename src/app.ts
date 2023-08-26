import express, { json, Application } from 'express';
import * as dotenv from "dotenv";
import morgan from 'morgan';
import { Controller } from './controller/controller';
import passport from 'passport';
import { server_config } from './config/server.config';


export const app:Application = express();;


    
dotenv.config({ path: "../.env.test" });
app.set("PORT", server_config.PORT||3001)
app.set("HOST", server_config.HOST||"localhost")


        
app.use(json());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use((req, res, next) => {
    let origin = req.headers.origin;
    if (origin == undefined) {
        res.setHeader("Access-Control-Allow-Origin", "*");
    } else {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

   
const controllers = new Controller().getController();
controllers.forEach((controller) => {
    app.use(controller.getRoutes());
});
    

    
