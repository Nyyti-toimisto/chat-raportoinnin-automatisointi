import { Credentials, NinQueue, NinSingeFeedback } from 'src/types';
import { fetchFeedbacks } from '../ninchat/api';
import { epochToISO } from '../util';

export class StateMemory {
    private rawQueue: NinQueue['queue_transcripts'] | null;
    private feedBacks: NinSingeFeedback[] | null;
    private userCount: number; // usercount is calculated from feedbacks which contain exactly 3 questions

    constructor() {
        this.rawQueue = null;
        this.userCount = 0;
        this.feedBacks = null;
    }

    set(rawQueue: NinQueue['queue_transcripts']) {
        this.rawQueue = rawQueue;
    }

    getRaw() {
        return this.rawQueue;
    }

    getFeedbacks() {
        return this.feedBacks;
    }

    async initFeedbacks(credentials: Credentials) {
        if (!this.rawQueue) {
            return;
        }
        this.feedBacks = await fetchFeedbacks(credentials, this.rawQueue);
        this.userCount = this.feedBacks
            ? this.feedBacks
                  .map((row) => Object.keys(row.audience_metadata.pre_answers).length === 3)
                  .filter(Boolean).length
            : 0;
    }

    getFeedbackMeta() {
        if (!this.rawQueue) {
            return null;
        }
        return {
            count: this.rawQueue.length,
            dates: {
                min: epochToISO(Math.min(...this.rawQueue.map((element) => element.complete_time))),
                max: epochToISO(Math.max(...this.rawQueue.map((element) => element.complete_time)))
            },
            userCount: this.userCount
        };
    }

    clear() {
        this.rawQueue = null;
    }
}
