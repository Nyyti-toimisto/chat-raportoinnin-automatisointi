import { unlink } from 'fs';
import { log } from 'console';
import { FeedbackPost, FeedbackPre } from '../tables/feedback';
import DbHandler from './util/dbHandler';
import exp from 'constants';
import { create } from 'domain';
import { createTables } from '../dao';

describe('open, (create), close and delete database', function () {
  const filepath = './testDb.db';
  let dbHandler: DbHandler


  const tableLogger = (tableName: string, message: string) => {
    log(`Dao: ${tableName} - ${message}`);
  };

  beforeAll(() => {
    unlink(filepath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') log('Good, no previous databases found');
        else throw err;
      }
    });
  });

  it('should open (and create) the database', async () => {
    await new Promise<void>((resolve) => {
      dbHandler = new DbHandler(filepath, tableLogger);
      setTimeout(() => {
        resolve();
      }, 500);
    });
  });

  it('should have created the file', function () {
    if (!dbHandler.dbExists()) throw new Error('Database file not found');
  });

  it('creates the tables', async () => {
    await new Promise<void>((resolve) => {
      createTables(dbHandler.dao);
      setTimeout(() => {
        resolve();
      }, 500);
    })
  });

  it('should have created 6 tables', async () => {
    dbHandler.dao.db.all(
      "SELECT name FROM sqlite_master WHERE type='table'",
      (err, rows: { name: string }[]) => {
        if (err) throw err;
        expect(rows.length).toBe(5);

        let tableNames = '';
        for (const row of rows) {
          tableNames += tableNames + row.name;
        }
        expect(tableNames).toContain(FeedbackPost.tableName);
        expect(tableNames).toContain(FeedbackPost.name_question);
        expect(tableNames).toContain(FeedbackPost.name_answer);
        expect(tableNames).toContain(FeedbackPre.tableName);
      }
    );
  });

  it('should close the database', async () => {
    let closed = false;

    closed = await dbHandler.closeDb();
    expect(closed).toBe(true);
  });

  afterAll(function () {
   dbHandler.removeDbFile();
  });
});
