import { NextFunction, Request, Response, Router } from "express";
import passport, { authenticate } from "passport";
import passportJWT from 'passport-jwt';
import {jwt_config} from "../config/jwt.config"
import { mysqlConnection } from "../db/mysql.connection";

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;


let jwtOpt:any = {};
            jwtOpt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
            jwtOpt.secretOrKey = jwt_config.JWT_SECRET_KEY;
            jwtOpt.session = false;
            jwtOpt.usernameField = "email",
            jwtOpt.passwordField = "password"
            
passport.use(new JwtStrategy(jwtOpt,async(jwtToken, done)=>  {
    let mysql = await mysqlConnection();
    try {
        let user = await mysql.query("SELECT * FROM profile WHERE email = ?",jwtToken.email);        
        if (user) {
            return done(undefined, user , jwtToken);
        } else {
            return done(undefined, false);
        }
    } catch (error) {
        return done(error, false); 
    }
    finally{
        mysql.release();
    }
}));
    
    


    