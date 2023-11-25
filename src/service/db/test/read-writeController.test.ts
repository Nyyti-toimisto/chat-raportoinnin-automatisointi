// import DbHandler from './util/dbHandler';
// import { log } from 'console';
// import { ReadController } from '../interfaces/ReadController';
// import { WriteController } from '../interfaces/WriteController';

// describe('Reads and writes to database', async () => {
//   const filepath = './testDb.db';

//   const tableLogger = (tableName: string, message: string) => {
//     log(`ReadController test: ${tableName} - ${message}`);
//   };
//   const db = new DbHandler(filepath, tableLogger);
//   const { feedbackPostTable, feedbackPreTable } = db.createTables();

//   const readController = new ReadController(db.dao);
//   const writeController = new WriteController(feedbackPreTable, feedbackPostTable);

//   it('Should insert new chat', async () => {
    

//   });

//   it('should have created the file', function () {

//   });

//   it('creates the tables', async () => {

//   });

//   it('should have created 6 tables', async () => {

//   });



//   afterAll(async () => {
//     let closed = false;

//     closed = await db.closeDb();
//     expect(closed).toBe(true);
//     db.removeDbFile();
//   });
// });

it('should pass', () => {
  expect(true).toBe(true);
})