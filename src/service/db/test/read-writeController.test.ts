import DbHandler from './util/dbHandler';
import { log } from 'console';
import { ReadController } from '../interfaces/ReadController';
import { WriteController } from '../interfaces/WriteController';
import { createTables } from '../dao';
import * as api from '../../ninchat/api';
import { feedbackMockData, queueMockData } from './util/consts';
import { epochToISO } from '../../util';
import { NinQueue } from '../../../types';


describe('Reads and writes to database', () => {
  const filepath = './testDb.db';

  const tableLogger = (tableName: string, message: string) => {
    log(`ReadController test: ${tableName} - ${message}`);
  };
  const db = new DbHandler(filepath, tableLogger);
  const { feedbackPostTable, feedbackPreTable } = createTables(db.dao);

  const readController = new ReadController(db.dao);
  const writeController = new WriteController(feedbackPreTable, feedbackPostTable);

  const NUMBER_OF_FEEDBACKS = 30

  it('Should load state with feedbacks', async () => {

    // The two mocks a layer on top of actual api calls,
    // the actual api calls are not tested here.
    jest.spyOn(api, 'fetchQueue').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(queueMockData(NUMBER_OF_FEEDBACKS))
      })
    })

    jest.spyOn(api, 'fetchFeedbacks').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve(feedbackMockData(NUMBER_OF_FEEDBACKS))
      })
    })

    // Credentials and begindate does not have any effect on the mockdata
    // they are to be tested in the api tests 
    await writeController.setState({
      username: 'something',
      password: 'something'
    }, '10-08-2023')


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
    expect(statistics!.dates.min).toBe(epochToISO(minDate)) //epochToISO is tested separetly, therefore we shall trust it
    expect(statistics!.dates.max).toBe(epochToISO(maxDate))

    const userCount = feedbacks!
      .map(row => Object.keys(row.audience_metadata.pre_answers).length === 3)
      .filter(Boolean).length

    expect(statistics!.userCount).toBe(userCount)

    // General assumption is that there are less post feedbacks than pre feedbacks
    // each pre feedback is mandatory, yet post feedback is not
    // if testing with low number of feedbacks, this might not be always true
    // since feedbacks are randomly generated for testing
    expect(statistics!.userCount).toBeLessThan(NUMBER_OF_FEEDBACKS)
    
  });

  it('creates the tables', async () => {

    

  });

  it('should have created 6 tables', async () => {

  });



  afterAll(async () => {
    let closed = false;

    closed = await db.closeDb();
    expect(closed).toBe(true);
    // db.removeDbFile();
  });
});

