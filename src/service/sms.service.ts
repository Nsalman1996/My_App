import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { aws_config } from "../config/aws.config";
import { Request, Response } from "express";
import { Utility } from "../utils/utility";
import { mysqlConnection } from "../db/mysql.connection";

export class SMSService{
    constructor(){  
    }

    async sendOTP(req:Request,res:Response){
        const mysql = await mysqlConnection(); 
        const message = await Utility.generateRandomCode(6,false,true,false,[]);

        const client = new SNSClient(aws_config);

        let param={
            MessageStructure:"string",
            Message: message,
            PhoneNumber: aws_config.country_code + req.body.mobile,
            // TopicArn:aws_config.TopicArn,
            MessageAttributes: {
                "AWS.SNS.SMS.SenderID": {
                    DataType: "String",
                    StringValue: "12"
                },
                "AWS.SNS.SMS.SMSType": {
                    DataType: "String",
                    StringValue: "Transactional"
                },
                "AWS.SNS.SMS.MaxPrice": {
                    DataType: "String",
                    StringValue: "1.00"
                }
            }
        }

        try {
            let user =  await mysql.query("SELECT * FROM profile WHERE email=? ",req.body.email)
            console.log(user);
            if(user[0].profile_id){
                let result = await mysql.query("UPDATE profile SET otp = ? WHERE profile_id = ?",[message,user[0].profile_id]);
                if(result){
                    const command = new PublishCommand(param);
                    client.send(command).then(data => {
                        console.log("Message sent:", data.MessageId);
                        let status = {
                        status_code:200,
                        message:"otp sent succefully"
                       }
                       res.status(status.status_code).send(status.message);
                      })
                      .catch(error => {
                        console.error(error, error.stack);
                        let status = {
                            status_code:400,
                            message:"unable to send otp"
                           }
                           res.status(status.status_code).send(status.message);
                      }); 
                }
                else{
                    let status = {
                        status_code:500,
                        message:"unabale to store otp in db"
                    };
                    res.status(status.status_code).send(status.message);      
                }
            }
            else{
                let status = {
                    status_code:401,
                    message:"Email is wrong no user found"
                }
                res.status(status.status_code).send(status.message);
            }
        } catch (error) {
            throw error
        }
        finally{
            mysql.release();
        }
    }
}