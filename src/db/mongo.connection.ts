import mongoose,{connect} from "mongoose";

const config = require('.././config/mongo.config');

export async function mongooseConnection() {
    try {
        const mongo = await connect(config.mongo_config);
        console.log("Mongoose connected to", mongo.connection.db.databaseName);
        mongo.connection.on("connected", () => {
            console.log("Mongo Connection Established");
          });
          mongo.connection.on("reconnected", () => {
            console.log("Mongo Connection Reestablished");
          });
          mongo.connection.on("disconnected", () => {
            console.log("Mongo Connection Disconnected");
            console.log("Trying to reconnect to Mongo ...");
            setTimeout(() => {
              mongoose.connect(config.mongo_config, {
                keepAlive: true,
                socketTimeoutMS: 3000, connectTimeoutMS: 3000
              });
            }, 3000);
          });
          mongo.connection.on("close", () => {
            console.log("Mongo Connection Closed");
          });
          mongo.connection.on("error", (error: Error) => {
            console.log("Mongo Connection ERROR: " + error);
          });
      
    } catch (error) {
        throw(error);
    }
}

mongooseConnection();
