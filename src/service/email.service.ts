import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"; 
import { aws_config } from "../config/aws.config";
import { Request, Response } from "express";


export class EmailService{
    constructor(){

    }


    async pushMail(req:Request,res:Response){
        const client = new SESClient(aws_config);
        let param = {
            Destination: {
                ToAddresses: [req.body.target_email]
            },
            Message: {
                Body: {
                    Html: {
                        Data: '<p>Test mail from Shipapp</p>'
                    }
                },
                Subject: {
                    Data: 'Test email'
                }
            },
            Source: req.body.source_email
        }

        try {
            const command = new SendEmailCommand(param);
            const response = await client.send(command);
            console.log(response);
            res.status(200).send(response);
        } catch (error) {
            res.status(500).send("unable to send email internal error");
            throw error
        }
    }
}