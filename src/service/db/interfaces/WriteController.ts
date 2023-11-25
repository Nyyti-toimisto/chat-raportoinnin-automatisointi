import { Credentials, NinSingeFeedback } from '../../../types';
import { FeedbackPre, FeedbackPost } from '../tables/feedback';
import { StateMemory } from '../State';
import { fetchQueue } from '../../ninchat/api';
import { epochToISO, mapPreFeedBack } from '../../util';


export class WriteController {
  feedBackPreTable: FeedbackPre;
  feedBackPostTable: FeedbackPost;
  state: StateMemory;

  constructor(
    feedBackPreTable: FeedbackPre,
    feedBackPostTable: FeedbackPost
  ) {
    this.feedBackPreTable = feedBackPreTable;
    this.feedBackPostTable = feedBackPostTable;
    this.state = new StateMemory();
  }

  //Chat session prefill details are stored in state where raw feedbacks
  // are stored along with metadata user provides in the prefill step
  // Only after user has checked information is correct, a new chat
  // log with feedbacks begin to upload from state.

  async setState(credentials: Credentials, beginDate: string) {
    const data = await fetchQueue(credentials, beginDate).catch((err) => {
      console.log(err)
      return null
    });
    if (!data) {
      throw new Error('Palautteita ei löytynyt');
    }
    this.state.set(data);
    await this.state.initFeedbacks(credentials);
    return this.state.getFeedbackMeta();
  }

  async processState() {

    const feedbacks = this.state.getFeedbacks();

    if (!feedbacks) {
      throw new Error('Palautteita ei ole ladattu')
    }

    for (const feedback of feedbacks) {

      if (Object.keys(feedback.audience_metadata.pre_answers).length === 3) {
        await this.addPreFeedBackRecord(feedback).catch((err) => {
          this.feedBackPreTable.log(err.message, true);
        });
      }
      else{
        for (const [question, answer] of Object.entries(feedback.audience_metadata.pre_answers)) {
          await this.addPostFeedBackRecord(question, answer, epochToISO(feedback.audience_metadata.complete_time ?? 0)).catch((err) => {
            this.feedBackPostTable.log(err.message, true);
          })
        }
      }
    }
  }


  async addPreFeedBackRecord(feedback: NinSingeFeedback) {
    try {
      const { feeling, gender, age } = mapPreFeedBack(feedback.audience_metadata.pre_answers)
      if (!feedback.audience_metadata.complete_time){
        this.feedBackPreTable.log('Complete time is null', true);
      }

      return this.feedBackPreTable
        .insert({
          user_id: Object.keys(feedback.audience_members)[0],
          date_submitted: epochToISO(feedback.audience_metadata.complete_time ?? 0),
          feeling: feeling,
          gender: gender,
          age: age
        })
        .catch((err) => {
          this.feedBackPreTable.log(err.message, true);
        });
    } catch (error) {
      this.feedBackPreTable.log(String(error), true);
    }

  }

  async addPostFeedBackRecord(question: string, answer: string, date:string) {

    return this.feedBackPostTable
      .insert({
        user_id: 'dummy_id',
        question: question,
        answer: answer,
        date_submitted: date
      })
      .catch((err) => {
        if (String(err).includes('UNIQUE constraint failed')) {
          console.log('Post feedback constraint error ------', err);
          return;
        }
        this.feedBackPostTable.log(`Fatal error: ` + err, true);
      });
  }
}
