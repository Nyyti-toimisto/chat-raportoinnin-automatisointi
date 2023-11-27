import moment from 'moment';
import {
  PostFeedBackRecord,
  PostFeedBackQuestionSummary,
  PreFeedBackRecord,
  PreFeedBackStatsSummary,
  LogSummaryBaseStats,
  OldestOrNewestRecord
} from '../../../types';
import { Dao } from '../dao';
import { DateRangePipeProp } from '../../../main/events';
import { edgeDate, groupAndCountAnswers, groupQuestions } from '../../util';

export class ReadController {
  dao: Dao;
  constructor(dao: Dao) {
    this.dao = dao;
  }

  async getLatestFeedBackTimestamp(): Promise<string> {
    return await new Promise((resolve, reject) => {
      this.dao.db.all(`
      SELECT MAX(date_submitted) AS latest FROM
      (
        SELECT date_submitted FROM feedback_post
        UNION
        SELECT date_submitted FROM feedback_pre
      )
      `, (err, rows) => {
        if (err) reject(err);
        if (rows) {
          const r = rows as { latest: string }[];
          resolve(r[0].latest);
        }
        else reject('No rows returned on dates set');
      });
    });

  }

  async getDateBarHighlights(): Promise<string[]> {
    const raw: string[] = await new Promise((resolve, reject) => {
      this.dao.db.all(`SELECT date_submitted FROM feedback_pre`, (err, rows) => {
        if (err) reject(err);
        if (rows) {
          const mappedRows = (rows as { date_submitted: string }[]).map((row) =>
            moment(row.date_submitted).format('YYYY-MM-DD')
          );
          resolve(Array.from(new Set(mappedRows)));
        } else reject('No rows returned on dates set');
      });
    });
    return raw;
  }

  async getPostFeedback(
    dates: DateRangePipeProp,
    closed = false
  ): Promise<PostFeedBackQuestionSummary[]> {
    const start = dates.start ? moment(dates.start).format('YYYY-MM-DD') : '2000-01-01';
    const end = dates.end ? moment(dates.end).format('YYYY-MM-DD') : '3000-01-01';

    const closedOrOpenFeedbacks = closed ? 'NOT' : '';

    //TODO: have tablenames be dynamic as is with other queries
    //TODO: separate the two, querying db and processing the data
    const raw: PostFeedBackRecord[] = await new Promise((resolve, reject) => {
      this.dao.db.all(
        `
        WITH fp_post AS (
          SELECT
              fp.id,
              fp.user_id,
              fp.question,
              fp.date_submitted,
              fp.answer
          FROM
              feedback_post fp),
          raw_result AS (
          SELECT
              fp.date_submitted,
              fp.id,
              fp.user_id,
              fp.question as q_hash,
              fp.answer as a_hash,
              fpa.answer,
              fpq.question 
          FROM
              fp_post fp
          LEFT JOIN feedback_post_answer fpa ON fpa.hash = fp.answer 
          LEFT JOIN feedback_post_question fpq ON fpq.hash = fp.question 
          )
          SELECT * FROM raw_result WHERE 
          date_submitted >= '${start}'
            AND 
          date_submitted <= '${end}'
          AND
          a_hash ${closedOrOpenFeedbacks} IN (SELECT answer
            FROM feedback_post
            GROUP BY answer
            HAVING COUNT(*) = 1)
        `,
        (err, rows) => {
          if (err) reject(err);
          if (rows) resolve(rows as PostFeedBackRecord[]);
          else reject('No rows returned on post feedback question set');
        }
      );
    });

    const processed = groupAndCountAnswers(groupQuestions(raw));

    return processed;
  }

  //TODO: separate the two, querying db and processing the data
  async getPreFeedbackStats(dates: DateRangePipeProp): Promise<PreFeedBackStatsSummary | null> {
    const start = dates.start ? moment(dates.start).format('YYYY-MM-DD') : '2000-01-01';
    const end = dates.end ? moment(dates.end).format('YYYY-MM-DD') : '3000-01-01';

    const raw: PreFeedBackRecord[] = await new Promise((resolve, reject) => {
      this.dao.db.all(
        `
                SELECT id, date_submitted, feeling, gender, age
                FROM feedback_pre
                WHERE 
                        date_submitted >= '${start}'
                        AND 
                        date_submitted <= '${end}'
            `,
        (err, rows) => {
          if (err) reject(err);
          if (rows) resolve(rows as PreFeedBackRecord[]);
          else reject(null);
        }
      );
    });

    if (raw.length === 0) return null

    const stats: PreFeedBackStatsSummary = {
      range: {
        start: edgeDate(raw, 'min'),
        end: edgeDate(raw, 'max')
      },
      feels: {
        positive: raw.filter((record) => record.feeling === 'Positiivinen').length,
        negative: raw.filter((record) => record.feeling === 'Negatiivinen').length,
        neutral: raw.filter((record) => record.feeling === 'Neutraali').length
      },
      age: {
        '18-24': raw.filter((record) => record.age === '18-24').length,
        '25-29': raw.filter((record) => record.age === '25-29').length,
        '30-35': raw.filter((record) => record.age === '30-35').length,
        '36-46': raw.filter((record) => record.age === '36-46').length,
        'Ei sano': raw.filter((record) => record.age === 'Ei halua kertoa').length
      },
      gender: {
        male: raw.filter((record) => record.gender === 'Mies').length,
        female: raw.filter((record) => record.gender === 'Nainen').length,
        other: raw.filter((record) => record.gender === 'Muu').length,
        unknow: raw.filter((record) => record.gender === 'En halua sanoa').length
      },
      chart: {
        // TODO: to improve performance if needed,
        // instead of mapping each feeling with its week and year,
        // thus sending large amounts of records,
        // map instructions to the front end how to assemble this data
        // itself. This way size of the array is limited
        // to number of weeks in the date range rather than number of
        // feedbacks.
        feel: raw.map((record) => {
          return {
            week: moment(record.date_submitted, 'YYYY-MM-DD').isoWeek(),
            year: moment(record.date_submitted, 'YYYY-MM-DD').year(),
            feeling: record.feeling,
            id: record.id
          };
        })
      }
    };

    return stats;
  }


  // TODO: nothing calls this yet. Should return statistics about pre and post
  // feedbacks.
  // Newest - oldest date
  // How many days in total, participants (from pre_feedbacks)
  // Adjust types LogSummaryBaseStats and OldestOrNewestRecord as needed
  async getLogPageSummary() {

    const numbers: LogSummaryBaseStats = await new Promise((resolve, reject) => {
      this.dao.db.get(
        ``,
        (err, row) => {
          if (err) reject(err);
          if (row) resolve(row as LogSummaryBaseStats);
          else reject('No rows returned on log page summary');
        }
      );
    });

    const otherRecords = async (whichOne: 'ASC' | 'DESC'): Promise<OldestOrNewestRecord> => {
      return await new Promise((resolve, reject) => {
        this.dao.db.get(
          ``,
          (err, row) => {
            if (err) reject(err);
            if (row) resolve(row as OldestOrNewestRecord);
            else reject('No rows returned on log page summary');
          }
        );
      });
    };
    return {
      ...numbers,
      oldest: await otherRecords('ASC').then((record) => record),
      newest: await otherRecords('DESC').then((record) => record)
    };
  }

}
