import DbHandler from './util/dbHandler';
import { log } from 'console';
import { ReadController } from '../interfaces/ReadController';
import { WriteController } from '../interfaces/WriteController';
import { createTables } from '../dao';
import * as api from '../../ninchat/api';
import { doArraysIntersect, feedbackMockData, queueMockData } from './util/consts';
import { epochToISO } from '../../util';
import { NinQueue, PostFeedBackQuestionSummary, PreFeedBackStatsSummary } from '../../../types';
import { FeedbackPost, FeedbackPre } from '../tables/feedback';
import { writeFileSync } from 'fs';


// Test suite tests the journey of the data from inserting it to database
// to reading it through the interfaces. Logic testing relies on mockdata
// being deterministic, and it has been chosen to be uniformally distributed.
// 50% of the feedbacks are prefeedbacks, and 50% are postfeedbacks, and
// every answer is answered equally amount of times.

describe('Reads and writes to database', () => {
  const filepath = './testDb2.db';

  const tableLogger = (tableName: string, message: string) => {
    log(`Controller test: ${tableName} - ${message}`);
  };
  const db = new DbHandler(filepath, tableLogger);
  const { feedbackPostTable, feedbackPreTable } = createTables(db.dao);

  const readController = new ReadController(db.dao);
  const writeController = new WriteController(feedbackPreTable, feedbackPostTable);


  const NUMBER_OF_FEEDBACKS = 120 // LCM*2 of 3,4,5

  it('Artificially waits for database to be ready', async () => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  })

  it('Should load state with feedbacks', async () => {

    // The two mocks a layer on top of actual api calls,
    // the actual api calls are not tested here.
    jest.spyOn(api, 'fetchQueue').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(queueMockData(NUMBER_OF_FEEDBACKS))
      })
    })
    // feedBackMockData needs to create timestamps based on queue timestamps
    jest.spyOn(api, 'fetchFeedbacks').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(feedbackMockData(writeController.state.getRaw()))
      })
    })

    // Credentials and begindate does not have any effect on the mockdata
    // they should be tested elsewhere
    await writeController.setState({
      username: 'user',
      password: 'nomnomnom'
    }, 'YYYY-MM-DD')


    const feedbacks = writeController.state.getFeedbacks()
    const statistics = writeController.state.getFeedbackMeta()
    const queue: NinQueue['queue_transcripts'] = writeController.state.getRaw()

    expect(feedbacks).toBeTruthy()
    expect(feedbacks).toHaveLength(NUMBER_OF_FEEDBACKS)
    expect(feedbacks![0].audience_metadata.pre_answers).toBeTruthy()
    expect(typeof feedbacks![0].audience_metadata.complete_time).toBe('number')


    expect(queue).toHaveLength(NUMBER_OF_FEEDBACKS)
    expect(typeof queue![0].audience_id).toBe('string')
    expect(typeof queue![0].complete_time).toBe('number')

    expect(statistics).toBeTruthy()
    expect(statistics!.count).toBe(NUMBER_OF_FEEDBACKS)

  });

  it('Statistics returned from state are correct', function () {

    const feedbacks = writeController.state.getFeedbacks()
    const statistics = writeController.state.getFeedbackMeta()
    const queue: NinQueue['queue_transcripts'] = writeController.state.getRaw()


    const minDate = Math.min(...queue.map(i => i.complete_time))
    const maxDate = Math.max(...queue.map(i => i.complete_time))

    //epochToISO is tested separetly
    expect(statistics!.dates.min).toBe(epochToISO(minDate))
    expect(statistics!.dates.max).toBe(epochToISO(maxDate))

    const userCount = feedbacks!
      .map(row => Object.keys(row.audience_metadata.pre_answers).length === 3)
      .filter(Boolean).length

    expect(statistics!.userCount).toBe(userCount)

    // General assumption is that there are less post feedbacks than pre feedbacks
    // each pre feedback is mandatory, yet post feedback is not
    // for testing purposes, we test that user count logic works
    expect(statistics!.userCount).toBeLessThan(NUMBER_OF_FEEDBACKS)

  });

  it('Processes the state and stores data in to database', async () => {

    const statistics = writeController.state.getFeedbackMeta()

    const rowCounts = async () => {
      return {
        pre: await db.getRowCount(FeedbackPre.tableName),
        post: await db.getRowCount(FeedbackPost.tableName),
        postAnswer: await db.getRowCount(FeedbackPost.name_answer),
      }
    }

    const oldRowCount = await rowCounts()
    await writeController.processState()
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    })
    const newRowCount = await rowCounts()

    expect(oldRowCount.pre).toBeLessThan(newRowCount.pre)
    expect(newRowCount.pre - oldRowCount.pre).toBe(statistics!.userCount)
    expect(oldRowCount.post).toBeLessThan(newRowCount.post)

    expect(oldRowCount.postAnswer).toBeLessThan(newRowCount.postAnswer)

    // number of questions do not increase randomly and therefore not tested

  }, 5000); // increase if increasing number of feedbacks

  describe('Reads pre feedbacks from database without date range', () => {
    let feedbacks: PreFeedBackStatsSummary | null

    it('Fetches prefeedbacks', async () => {
      feedbacks = await readController.getPreFeedbackStats(
        { start: undefined, end: undefined })
    })

    it('Received feedback and has beginning and an end', async () => {
      expect(feedbacks).toBeTruthy()
      expect(new Date(feedbacks!.range.start).getTime())
        .toBeLessThan(new Date(feedbacks!.range.end).getTime())
    })

    it('Parses statistics correctly', async () => {
      const numberOfPrefeedbacks = NUMBER_OF_FEEDBACKS / 2

      expect(feedbacks!.feels.positive).toBe(numberOfPrefeedbacks / 3)
      expect(feedbacks!.feels.negative).toBe(numberOfPrefeedbacks / 3)
      expect(feedbacks!.feels.neutral).toBe(numberOfPrefeedbacks / 3)
      expect(feedbacks!.age['18-24']).toBe(numberOfPrefeedbacks / 5)
      expect(feedbacks!.age['25-29']).toBe(numberOfPrefeedbacks / 5)
      expect(feedbacks!.age['30-35']).toBe(numberOfPrefeedbacks / 5)
      expect(feedbacks!.age['36-46']).toBe(numberOfPrefeedbacks / 5)
      expect(feedbacks!.age['Ei sano']).toBe(numberOfPrefeedbacks / 5)
      expect(feedbacks!.gender.male).toBe(numberOfPrefeedbacks / 4)
      expect(feedbacks!.gender.female).toBe(numberOfPrefeedbacks / 4)
      expect(feedbacks!.gender.other).toBe(numberOfPrefeedbacks / 4)
      expect(feedbacks!.gender.unknow).toBe(numberOfPrefeedbacks / 4)

    })

    it('Maps feelings by week and year correctly', async () => {


      feedbacks!.chart.feel.forEach((row) => {
        expect(doArraysIntersect(
          ['Positiivinen', 'Negatiivinen', 'Neutraali'], [row.feeling])).toBeTruthy()

        expect(row.week).toBeLessThanOrEqual(52)
        expect(row.week).toBeGreaterThanOrEqual(1)
        expect(row.year).toBeGreaterThanOrEqual(1000)
        expect(row.year).toBeLessThanOrEqual(9999)
        expect(typeof row.id).toBe('number')
      })
    })
  })

  describe('Reads closed postfeedback without dates', () => {
    let feedbacks: PostFeedBackQuestionSummary[] | null

    it('Fetches feedbacks', async () => {
      feedbacks = await readController.getPostFeedback(
        { start: undefined, end: undefined }, true)
        writeFileSync('./closedPost.json', JSON.stringify(feedbacks))
    })

    it('There are correct amount of questions summarized', () => {

      expect(feedbacks).toBeTruthy()
      // There are 9 questions in total, defined in mockdata.
      expect(feedbacks).toHaveLength(9) 

    })

    it('Each question has even distribution of answers', () => {

      feedbacks!.forEach((question) => {
        const answerCount = Object.values(question.answers).map(i => i.count)
        const max = Math.max(...answerCount)
        const min = Math.min(...answerCount)
        expect(max - min).toBeLessThanOrEqual(0)
      })

    })
  })

  // TODO 'Reads prefeedbacks within the date range'
  //    - Mockdata needs to be refactored to be deterministic on the dates
  // TODO 'Reads postfeedbacks within the date range'
  //   - Mockdata needs to be refactored to be deterministic on the dates


  afterAll(async () => {
    let closed = false;

    closed = await db.closeDb();
    expect(closed).toBe(true);

    let counter = 0;
    while (true) {
      if (counter > 5) {
        throw new Error('Could not remove database file');
      }
      try {
        await db.removeDbFile();
        break

      } catch (error) {
        counter++
      }
    }
  });
});

