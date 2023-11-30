import { Credentials, NinQueue, NinSingeFeedback } from 'src/types';
import { StateMemory } from '../db/State';

export const fetchQueue = (credentials: Credentials, beginDate: string) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            caller_type: 'email',
            caller_name: credentials.username,
            caller_auth: credentials.password,
            action: 'describe_queue_transcripts',
            queue_id: '8vqvq89d004us',
            interval_begin: new Date(beginDate).getTime() / 1000
            // interval_end: new Date(date).setHours(23, 59, 59, 0) / 1000 //time in seconds, not milli- or nanoseconds
        })
    };

    return fetch('https://api.ninchat.com/v2/call', options)
        .then((res) => {
            if (res.status !== 200) {
                throw res;
            }
            return res;
        })
        .then((res) => res.json())
        .then((res) => {
            if (res['error_type'] === 'access_denied') {
                throw { status: 403, statusText: 'access_denied' };
            }
            return (res as NinQueue).queue_transcripts;
        });
};

const fetchSingeFeedback = (credentials: Credentials, audience_id: string, time:number) => {

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            caller_type: "email",
            caller_name: credentials.username,
            caller_auth: credentials.password,
            action: "get_transcript",
            audience_id: audience_id,
            stats_length: 1000,
            interval_begin: 0
        })
    };

    return fetch('https://api.ninchat.com/v2/call', options)
        .then((res) => {
            if (res.status !== 200) {
                throw res;
            }
            return res;
        })
        .then((res) => res.json())
        .then((res) => {
            if (res['error_type'] === 'access_denied') {
                throw { status: 403, statusText: 'access_denied' };
            }
            (res as NinSingeFeedback).audience_metadata.complete_time = time
            return (res as NinSingeFeedback);
        });

}

export const fetchFeedbacks = async (credentials: Credentials, queue: StateMemory['rawQueue']) => {
    console.log('fetching feedbacks')
    if (!queue) {
        console.log('no queue')
        return null
    }

    const results: Promise<NinSingeFeedback>[]= []

    for (const feedback of queue) {
        results.push(fetchSingeFeedback(credentials, feedback.audience_id, feedback.complete_time))
    }
    const res = await Promise.all(results)

    return res


}