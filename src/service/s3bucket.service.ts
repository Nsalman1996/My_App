import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { aws_config } from "../config/aws.config";
import { Request, Response } from "express";
import multer from "multer";
import { Utility } from "../utils/utility";

export class S3Bucket{
   
    upload = multer();
    constructor(){

    }


    async uploadImage(req:Request,res:Response){

    let fileInfo:any = req.files;            
    let opts = {
        Bucket:aws_config.Bucket,
        Key: "profile_pic/"+Utility.generateuuid()+"_"+fileInfo[0].originalname,
        Body:fileInfo[0].buffer
    }
    let s3bucket = new S3(aws_config)
    const command = new PutObjectCommand(opts);
    
       let result = await s3bucket.send(command,(err:any,data:any)=>{
                if (err) {
                    console.log(err)
                    let response = { error: err, statusCode: 400 };
                    res.send(JSON.stringify(response));
                  }
                  else{
                    console.log(data);
                      let response = { error: "", statusCode: 200, fileLocation: data };
                      res.send(JSON.stringify(response));
                  }
                });
                console.log("result-->",result);
            }
}

