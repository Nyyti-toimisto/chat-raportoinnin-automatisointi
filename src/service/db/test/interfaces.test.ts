import DbHandler from './util/dbHandler';
import { log } from 'console';
import { ReadController } from '../interfaces/ReadController';
import { WriteController } from '../interfaces/WriteController';
import { createTables } from '../dao';
import * as api from '../../ninchat/api';
import { feedbackMockData, queueMockData } from './util/consts';
import { epochToISO } from '../../util';
import { NinQueue, NinSingeFeedback } from '../../../types';
import { FeedbackPost, FeedbackPre } from '../tables/feedback';
import moment from 'moment';


describe('Reads and writes to database', () => {
  const filepath = './testDb2.db';

  const tableLogger = (tableName: string, message: string) => {
    log(`Controller test: ${tableName} - ${message}`);
  };
  const db = new DbHandler(filepath, tableLogger);
  const { feedbackPostTable, feedbackPreTable } = createTables(db.dao);

  const readController = new ReadController(db.dao);
  const writeController = new WriteController(feedbackPreTable, feedbackPostTable);

  const NUMBER_OF_FEEDBACKS = 30

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
    }, '10-11-2023')


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

    // in the mockdata, freeform answers are geenrated randomly
    // therefore it is almost guaranteed to increase
    expect(oldRowCount.postAnswer).toBeLessThan(newRowCount.postAnswer)

    // number of questions do not increase randomly and therefore not tested

  });

  it('Reads all preFeedbacks if not specifying the dates', async () => {

    const feedbacks = await readController.getPreFeedbackStats({ start: undefined, end: undefined })

    expect(feedbacks).toBeTruthy()
    expect(new Date(feedbacks!.range.start).getTime())
      .toBeLessThan(new Date(feedbacks!.range.end).getTime())
    
  })

  // TODO 'Reads prefeedbacks within the date range'
  // TODO 'Reads postfeedbacks if not specifying the dates'
  // TODO 'Reads postfeedbacks within the date range'


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

