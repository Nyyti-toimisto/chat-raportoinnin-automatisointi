import { Credentials, NinQueue, NinSingeFeedback } from 'src/types';
import { fetchFeedbacks } from '../ninchat/api';

export class StateMemory {
    private rawQueue: NinQueue['queue_transcripts'] | null;
    private feedBacks: NinSingeFeedback[] | null;
    private timestamp: any;
    private userCount: number; // usercount is calculated from feedbacks which contain exactly 3 questions


    constructor() {
        this.rawQueue = null;
        this.timestamp = null;
        this.userCount = 0;
        this.feedBacks = null;
    }

    set(rawQueue: NinQueue['queue_transcripts']) {
        this.timestamp = new Date();
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
        this.userCount = this.feedBacks ?
            (this.feedBacks
                .map(row => Object.keys(row.audience_metadata.pre_answers).length === 3).filter(Boolean).length)
            : 0
    }


    getFeedbackMeta() {
        if (!this.rawQueue) {
            return null;
        }
        return {
            count: this.rawQueue.length,
            dates: {
                min: new Date(
                    Math.min(
                        ...this.rawQueue.map((element) => {
                            const d = new Date(element.complete_time*1000)
                            return d.getTime();
                        })
                    )
                ).toISOString(),
                max: new Date(
                    Math.max(
                        ...this.rawQueue.map((element) => {
                            const d = new Date(element.complete_time*1000)
                            return d.getTime();
                        })
                    )
                ).toISOString()
            },
            userCount: this.userCount
        };
    }

    clear() {
        this.rawQueue = null;
        this.timestamp = null;
    }

    isOlderThan(minutes: number) {
        return new Date().getTime() - this.timestamp.getTime() > minutes * 60 * 1000;
    }
}
