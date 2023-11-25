import { log } from "console";
import { Dao, createTables } from "../../dao";
import { existsSync, unlink } from "fs";


class dbHandler {

    dao: Dao;
    filepath: string;

    constructor(filepath: string, tableLogger: (tableName: string, message: string) => void) {
        this.dao = new Dao(filepath, tableLogger);
        this.filepath = filepath;
    }

    dbExists() {
        return existsSync(this.filepath)
    }

    removeDbFile(){
        setTimeout(() => {
            unlink(this.filepath, function (err) {
              if (err) log(err);
            });
          }, 300);
    }

    async createTables() {
        await new Promise<void>((resolve) => {
            createTables(this.dao);
            setTimeout(() => {
              resolve();
            }, 300);
          });
    }

    async closeDb(){
        return await new Promise<boolean>((resolve) => {
            this.dao.db.close((err) => {
              if (err) {
                resolve(false);
              }
            });
            resolve(true);
          });
    }



}