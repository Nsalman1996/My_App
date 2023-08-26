import * as mysql from 'mysql';


const config = require(".././config/mysql.config");
export const sql = mysql.createPool(config.mysql_config);


    export const mysqlConnection = ():Promise<any> => {
        return new Promise((resolve, reject) => {
            sql.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log("Mysql aquired connection" + connection);
                    const query = (query: mysql.Query, bindings: any) => {
                        return new Promise((resolve, reject) => {
                            connection.query(query, bindings, (err, results) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(results);
                                }
                            })
                        })
                    }

                    const release = () => {
                        return new Promise((resolve, reject) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                console.log("Mysql connection released");
                                resolve(connection.release());
                            }
                        })
                    }
                    resolve({ query, release });
                }
            })
        })
    }
