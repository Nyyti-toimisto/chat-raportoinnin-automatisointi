import { Database } from 'sqlite3';
import { ChatSession } from './tables/chat_session';
import { FeedbackPost, FeedbackPre } from './tables/feedback';
import { DaoLogger } from '../../types';

export const daoLogger: DaoLogger = (tableName: string, message: string, error = false) => {
  const l = error ? console.error : console.log;
  l(`Dao: ${tableName} - ${message}`);
};

export class Dao {
  db: Database;
  log: DaoLogger;
  constructor(path: string, logger: DaoLogger) {
    this.log = logger;
    this.db = new Database(path, (err) => {
      if (err) {
        this.log('system', err.message);
        throw err;
      }
      this.log('system', 'Connected to the SQLite database.');
    });
    this.db.get('PRAGMA foreign_keys = ON');
  }
}

export const createTables = (dao: Dao) => {
  const sessionTable = new ChatSession(dao);
  const feedbackPreTable = new FeedbackPre(dao);
  const feedbackPostTable = new FeedbackPost(dao);

  return {
    sessionTable,
    feedbackPreTable,
    feedbackPostTable
  };
};

// sessionTable.insert(new Date().toISOString(), 'test', 1, 'test details');
