import { TChatSessionRecord } from '../../../types';
import { Dao } from '../dao';

export class ChatSession {
  static tableName = 'chat_session';
  private dao: Dao;

  constructor(dao: Dao) {
    this.dao = dao;

    const sql = `CREATE TABLE IF NOT EXISTS ${ChatSession.tableName} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_date DATETIME NOT NULL,
            created DATETIME DEFAULT CURRENT_TIMESTAMP,
            topic TEXT,
            participant_count INTEGER,
            hosts TEXT NOT NULL,
            comments_from_host TEXT,
            details TEXT
        );`;

    this.dao.db.run(sql, (err) => {
      if (err) {
        this.log(err.message, true);
        return;
      }
    });
  }

  insert(data: TChatSessionRecord): Promise<number | Error | null> {
    const { chat_date, topic, hosts, participant_count, comments_from_host, details } = data;

    return new Promise((resolve, reject) => {
      this.dao.db.run(
        `INSERT INTO ${ChatSession.tableName} \
              (chat_date, topic,hosts, participant_count, comments_from_host, details) \
              VALUES (?,?,?,?,?,?)`,
        [chat_date, topic, hosts, participant_count, comments_from_host, details],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  getAll() {
    return new Promise<TChatSessionRecord[]>((resolve, reject) => {
      this.dao.db.all(
        `SELECT * FROM ${ChatSession.tableName}`,
        (err, rows: TChatSessionRecord[]) => {
          if (err) {
            this.log(err.message, true);
            reject(err.message);
          }
          resolve(rows);
        }
      );
    });
  }

  log(message: string, error = false) {
    this.dao.log(`/table ${ChatSession.tableName}`, message, error);
  }

  test(): void {
    console.log('test Im a test look at me!!');
  }
}
