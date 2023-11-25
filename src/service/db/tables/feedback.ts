import { Dao } from '../dao';
import {
  FeedbackAnswerRecord,
  FeedbackPostEntry,
  FeedbackPreEntry,
  FeedbackQuestionRecord,
  TChatSessionRecord
} from '../../../types';
import md5 from 'md5';

export class FeedbackPre {
  static tableName = 'feedback_pre';
  private dao: Dao;

  constructor(dao: Dao) {
    this.dao = dao;
    const sql = `CREATE TABLE IF NOT EXISTS ${FeedbackPre.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            date_submitted TIMESTAMP NOT NULL,
            feeling TEXT NOT NULL,
            gender TEXT,
            age TEXT
        );`;
    this.dao.db.run(sql, (err) => {
      if (err) {
        this.log(err.message);
        return;
      }
    });
  }

  insert(data: FeedbackPreEntry): Promise<number | Error | null> {
    const { user_id, feeling, gender, age, date_submitted } = data;

    return new Promise<number>((resolve, reject) => {
      this.dao.db.run(
        `INSERT INTO ${FeedbackPre.tableName} \
                (user_id, feeling, gender, age, date_submitted) \
                VALUES (?,?,?,?,?)`,
        [user_id, feeling, gender, age, date_submitted],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  getAll() {
    return new Promise<TChatSessionRecord[]>((resolve, reject) => {
      this.dao.db.all(`SELECT * FROM ${FeedbackPre.name}`, (err, rows: TChatSessionRecord[]) => {
        if (err) {
          this.log(err.message, true);
          reject(err.message);
        }
        resolve(rows);
      });
    });
  }

  log(message: string, error = false) {
    this.dao.log(`/table ${FeedbackPre.name}`, message, error);
  }

  test(): void {
    this.log('test call');
  }
}

export class FeedbackPost {
  static tableName = 'feedback_post';
  static name_question = 'feedback_post_question';
  static name_answer = 'feedback_post_answer';
  private dao: Dao;

  // Only one table can be created at a time in sqlite3
  constructor(dao: Dao) {
    this.dao = dao;

    const sqlTable1 = `
            CREATE TABLE IF NOT EXISTS ${FeedbackPost.name_question} (
            hash TEXT NOT NULL PRIMARY KEY,
            date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            question TEXT NOT NULL
        );`;

    const sqlTable2 = `
            CREATE TABLE IF NOT EXISTS ${FeedbackPost.name_answer} (
            hash TEXT NOT NULL PRIMARY KEY,
            date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            answer TEXT NOT NULL
        );
        `;
    const sqlTable3 = `
            CREATE TABLE IF NOT EXISTS ${FeedbackPost.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            date_submitted TIMESTAMP NOT NULL,
            question INTEGER NOT NULL,
            answer INTEGER NOT NULL,
            FOREIGN KEY (question) REFERENCES ${FeedbackPost.name_question}(hash),
            FOREIGN KEY (answer) REFERENCES ${FeedbackPost.name_answer}(hash)
        );`;

    this.dao.db
      .run(sqlTable1, (err) => {
        if (err) {
          this.log(err.message);
          return;
        }
      })
      .run(sqlTable2, (err) => {
        if (err) {
          this.log(err.message);
          return;
        }
      })
      .run(sqlTable3, (err) => {
        if (err) {
          this.log(err.message);
          return;
        }
      });
  }

  async insert(data: FeedbackPostEntry): Promise<number | Error | null> {
    const { user_id, question, answer, date_submitted } = data;

    const answerId = await this.getAnswerHash(answer);
    const questionId = await this.getQuestionHash(question);

    return new Promise((resolve, reject) => {
      this.dao.db.run(
        `INSERT INTO ${FeedbackPost.tableName} \
            (user_id, question, answer, date_submitted) \
            VALUES (?,?,?,?)`,
        [user_id, questionId, answerId, date_submitted],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  async getAnswerHash(answer: string) {
    const hash = md5(answer);

    const rowHash = await new Promise<string>((resolve, reject) => {
      this.dao.db.get(
        `SELECT hash FROM ${FeedbackPost.name_answer} WHERE hash = ?`,
        [hash],
        function (err, row: FeedbackAnswerRecord) {
          if (err) {
            reject(err);
          }
          if (row) resolve(row.hash);
          reject(false);
        }
      );
    }).catch((err) => err);

    if (rowHash) return rowHash;

    return this.addNewAnswer(answer)
      .then((id) => id)
      .catch((err) => {
        this.log(err.message, true);
      });
  }

  async getQuestionHash(question: string) {
    const hash = md5(question);

    const rowHash = await new Promise<string>((resolve, reject) => {
      this.dao.db.get(
        `SELECT hash FROM ${FeedbackPost.name_question} WHERE hash = ?`,
        [hash],
        function (err, row: FeedbackQuestionRecord) {
          if (err) {
            reject(err);
          }
          if (row) resolve(row.hash);
          reject(false);
        }
      );
    }).catch((err) => err);

    if (rowHash) return rowHash;

    return this.addNewQuestion(question)
      .then((id) => id)
      .catch((err) => {
        this.log(err.message, true);
      });
  }

  addNewAnswer(answer: string) {
    const hash = md5(answer);

    return new Promise<string>((resolve, reject) => {
      this.dao.db.run(
        `INSERT INTO ${FeedbackPost.name_answer} (hash, answer) VALUES (?,?)`,
        [hash, answer],
        function (err) {
          if (err) {
            reject(err.message);
          }
          resolve(hash);
        }
      );
    });
  }

  addNewQuestion(question: string) {
    const hash = md5(question);

    return new Promise<string>((resolve, reject) => {
      this.dao.db.run(
        `INSERT INTO ${FeedbackPost.name_question} (hash, question) VALUES (?,?)`,
        [hash, question],
        function (err) {
          if (err) {
            reject(err.message);
          }
          resolve(hash);
        }
      );
    });
  }

  log(message: string, error = false) {
    this.dao.log(`/table ${FeedbackPost.tableName}`, message, error);
  }

  test(): void {
    this.log('test call');
  }
}
