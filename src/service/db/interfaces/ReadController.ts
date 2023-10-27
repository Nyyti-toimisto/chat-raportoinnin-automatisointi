import moment from 'moment';
import {
  LogSummaryBaseStats,
  OldestOrNewestRecord,
  PostFeedBackRecord,
  PostFeedBackQuestionSummary,
  PreFeedBackRecord,
  PreFeedBackStatsSummary
} from '../../../types';
import { Dao } from '../dao';
import { ChatSession } from '../tables/chat_session';
import { FeedbackPre, FeedbackPost } from '../tables/feedback';
import { DateRangePipeProp } from '../../../main/events';
import { edgeDate, groupAndCountAnswers, groupQuestions } from '../../util';

export class ReadController {
  dao: Dao;
  constructor(dao: Dao) {
    this.dao = dao;
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
    const raw: PostFeedBackRecord[] = await new Promise((resolve, reject) => {
      this.dao.db.all(
        `
        WITH fp_post AS (
          SELECT
              fp.chat_id,
              fp.id,
              fp.user_id,
              fp.question,
              fp.date_submitted,
              fp.answer
          FROM
              feedback_post fp),
          raw_result AS (
          SELECT
              fp.chat_id,
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

  async getLogPageSummary() {
    const numbers: LogSummaryBaseStats = await new Promise((resolve, reject) => {
      this.dao.db.get(
        `
                SELECT 
                COUNT(sess.id) AS session_count,
                SUM(sess.participant_count) AS total_participants,
                COUNT(pre.id) AS pre_feedback_count,
                COUNT(post.id) AS post_feedback_count
                FROM ${ChatSession.tableName} sess
                LEFT JOIN ${FeedbackPre.tableName} pre ON sess.id = pre.id
                LEFT JOIN ${FeedbackPost.tableName} post ON sess.id = post.id;`,
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
          `
                    SELECT 
                        COUNT(sess.id) AS session_count,
                        SUM(sess.participant_count) AS total_participants,
                        COUNT(pre.id) AS pre_feedback_count,
                        COUNT(post.id) AS post_feedback_count,
                        chat_date,
                        hosts
                    FROM ${ChatSession.tableName} sess
                    LEFT JOIN ${FeedbackPre.tableName} pre ON sess.id = pre.id
                    LEFT JOIN ${FeedbackPost.tableName} post ON sess.id = post.id
                    WHERE sess.id = (
                        SELECT id 
                        FROM ${ChatSession.tableName}
                        ORDER BY chat_date ${whichOne}
                        LIMIT 1
                    );`,
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
