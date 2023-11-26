import { Dao } from "../../dao";
import { existsSync, unlink } from "fs";


export default class DbHandler {

    dao: Dao;
    filepath: string;

    constructor(filepath: string, tableLogger: (tableName: string, message: string) => void) {
        this.dao = new Dao(filepath, tableLogger);
        this.filepath = filepath;

    }

    dbExists() {
        return existsSync(this.filepath)
    }

    removeDbFile() {
        return new Promise<void>((res, rej) => {
            setTimeout(() => {
                unlink(this.filepath, function (err) {
                    if (err) rej(err);
                    res()
                });
            }, 200);
            
        })
    }


    closeDb() {
        return new Promise<boolean>((resolve) => {
            this.dao.db.close((err) => {
                if (err) {
                    resolve(false);
                }
            });
            resolve(true);
        });
    }

    getRowCount(tableName: string) {
        return new Promise<number>((resolve, reject) => {
            this.dao.db.get(`SELECT COUNT(*) FROM ${tableName}`, (err, row) => {
                if (err) {
                    reject(err.message);
                }
                resolve((row as {[key:string]:number})['COUNT(*)']);
            });
        });
    }

}