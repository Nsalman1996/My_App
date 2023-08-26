import pg, { Pool, Query } from 'pg';



const config = require('.././config/postgres.config');
export const pool = new Pool(config.postgres_config);

export const postgresConnection = ():Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.connect((err, client) => {
            if (err) {
                reject(err);
            }
            else {
                console.log("Postgres aquiring client" + client);
                const query = (query: any, bindings: any[]) => {
                    return new Promise((resolve, reject) => {
                        client.query(query, bindings, (err, result)=> {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(result);
                            }
                        });
                    });
                }

                const release = () => {
                    return new Promise((resolve, reject) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            console.log("Postgres client released");
                            resolve(client.release());
                        }
                    })
                }
                resolve({ query, release });
            }
        })
    })
}