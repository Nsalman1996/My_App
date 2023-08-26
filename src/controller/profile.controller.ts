import { Router, Request, Response } from "express";
import { IProfile } from '../model/profile.model';
// import { postgresConnection } from '../db/postgres.connection';
// import profileSchema from "../mongo_schema/profile.schema";
import bcrypt from 'bcrypt';
import { mysqlConnection } from "../db/mysql.connection";
import jsonwebtoken from "jsonwebtoken";
import {jwt_config} from "../config/jwt.config"
import { AuthController } from "../middleware/auth.middleware";
import multer from "multer";
import { S3Bucket } from "../service/s3bucket.service";
import { SMSService } from "../service/sms.service";
import { EmailService } from "../service/email.service";

export class ProfileController {
    router: Router;
    authController = new AuthController();
    s3Bucket = new S3Bucket();
    smsService = new SMSService();
    emailService = new EmailService();
    upload = multer();
    constructor() {
        this.router = Router();
        // this.router.use(this.authController.authenticateJWT)
    }
    getRoutes(){
        this.routes();
        return this.router;
    }

    routes() {
        this.router.post("/api/profile/signup", this.signUp);
        this.router.post("/api/profile/signin",this.sginIn);
        this.router.get("/api/profile/getuser",this.authController.authenticateJWT, this.getUser);
        this.router.patch("/api/profile/updateuser",this.authController.authenticateJWT, this.updateUser);
        this.router.delete("/api/profile/deleteuser",this.authController.authenticateJWT, this.deleteUser);
        this.router.post("/api/profile/uploadimage",this.upload.any(),this.s3Bucket.uploadImage);
        this.router.post("/api/profile/forgetpassword",this.smsService.sendOTP);
        this.router.post("/api/profile/verifyotp",this.verifyOtp);
        this.router.post("/api/profile/sendemail",this.emailService.pushMail);
    
    }

    async signUp(req: Request, res: Response) {
        let user: IProfile = req.body;    
        const mysql = await mysqlConnection(); 
        // const postgres = await postgresConnection();  
        
        try {
            
            bcrypt.hash(user.password,10,async (err,hash)=>{
                user.password = hash
                // profileSchema.create(user).then(result=>res.send(result));
                // let result = await postgres.query("INSERT INTO profile(name, password, email, mobile) VALUES ($1,$2,$3,$4) RETURNING *", [user.name,user.password,user.email,user.mobile])
                // res.send(result["rows"]);
               
                let callback = await mysql.query("INSERT INTO profile SET ?",user);
                let result = await mysql.query("SELECT * FROM profile WHERE profile_id = ? ",callback["insertId"]); 
                res.redirect(307,"/api/profile/signin");
            })
        } catch (error) {
            throw (error);
        }
        finally {
            // postgres.release();
            mysql.release();
        }
    }
    async getUser(req: Request, res: Response) {
        let user = req.query;
        // const postgres = await postgresConnection();
        const mysql = await mysqlConnection();
        
        try {
            // let result = await postgres.query("SELECT * FROM profile WHERE profile_id=$1",[user.profile_id]);
            let result = await mysql.query("SELECT * FROM profile WHERE profile_id = ?",user.profile_id);
            // const result = await profileSchema.findById(user._id);
            // res.send(result["rows"]);
            res.send(result);
        } catch (error) {
            throw(error)
        }
        finally{
            // postgres.release();
            mysql.release();
        }
    }
    async updateUser(req: Request, res: Response) {
        let query = req.query;
        let user:IProfile = req.body;
        // const postgres = await postgresConnection();
        const mysql = await mysqlConnection();
        try {
            // let result = await postgres.query("UPDATE profile SET name = $1, mobile = $2  WHERE profile_id = $3 RETURNING *",[user.name,user.mobile,query.profile_id]);
            let callback = await mysql.query("UPDATE profile SET ? WHERE profile_id = ?",[user,query.profile_id]);
            let result = await mysql.query("SELECT * FROM profile WHERE profile_id = ?", query.profile_id);
            // await profileSchema.updateOne({_id: query._id},{$set:user});
            // let result = await  profileSchema.findById({_id:query._id}); 
            // res.send(result["rows"]);
            res.send(result);
        } catch (error) {
            throw(error);
        }
        finally{
            // postgres.release();
            mysql.release();
        }
    }
    async deleteUser(req: Request, res: Response) {
        let query = req.query;
        // const postgres = await postgresConnection();
        const mysql = await mysqlConnection();
        try {
                // let result = await postgres.query("DELETE FROM profile WHERE profile_id = $1 RETURNING *",[query.profile_id]);
                let result = await mysql.query("DELETE FROM profile WHERE profile_id = ?", query.profile_id);
                // let result = await profileSchema.deleteOne({_id:query._id});
                // res.send(result["rows"]);
                res.send(result);
            } catch (error) {
            throw(error);
        }
        finally{
            // postgres.release();
            mysql.release();
        }
    }

    async sginIn(req: Request, res: Response){
        let user = req.body;
        let mysql = await mysqlConnection();
        // let postgres = await postgresConnection();
        try {
            if(user.email&& user.password){

                // let user = await profileSchema.find({email:user.email});
                let profile = await mysql.query("SELECT * FROM profile WHERE email = ?", user.email);
                // let user = await postgres.query("SELECT * FROM profile WHERE email = $1",[user.email]);
                if(profile){
                        bcrypt.compare(user.password, profile[0].password,(err,result)=>{  //mysql
                        // bcrypt.compare(body.password, user["rows"][0].password,(err,result)=>{ //postgres
                        // bcrypt.compare(body.password, user.password,(err,result)=>{ //mongo
                            if(err){
                                throw (err)
                            }
                            else{
                                if(result){
                                    let  token = jsonwebtoken.sign(user,jwt_config.JWT_SECRET_KEY);
                                    res.status(200).send({"token":token});
                                }
                                else{
                                    res.status(401).send("Wrong Password");
                                }
                            }
                           })
                    }
                    else{
                        res.status(404).send("No User Found");
                    }
            }
              else{
                res.status(404).send("No email or password");
              }
        } catch (error) {
          throw(error);  
        }
        finally{
            mysql.release();
            // postgres.release();
        }
    }
    async forgetPassword(req: Request, res: Response){
        try {
            console.log(req.body);
            if(this.smsService != undefined){
                // await this.smsService.sendOTP(req,res);
                console.log("defiened")
            
            }
            else{
                console.log("undefiened")
            }
            // if(result?.status_code == 200){
            //     res.status(200).send(result.message);
            // }
            // else{
            //     res.send(result?.message);
            // }
        } catch (error) {
            throw error;
        }
    }

    async verifyOtp(req: Request, res: Response){
        let param  = req.body;
        let mysql  = await mysqlConnection();

        try {
            let result = await mysql.query("SELECT * FROM profile WHERE email = ?", param.email)
            console.log(result)
            if(result[0].otp == param.otp){
                res.status(200).send("otp verification successfull");
            }
            else{
                res.status(403).send("wrong otp");
            }
        } catch (error) {
           throw error; 
        }
        finally{
            mysql.release();
        }
    }

}