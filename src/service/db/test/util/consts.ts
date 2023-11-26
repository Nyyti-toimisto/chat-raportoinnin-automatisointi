import { NinQueue, NinSingeFeedback } from "../../../../types"
import { randomBytes } from "crypto"

// ninchat uses time in seconds not milliseconds
function randomNinTimeStamp(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min) / 1000
}

const randomFromArray = <T,>(arr: T[]) => {
    return arr[~~(Math.random() * arr.length)]
}

// input: [1,2,3], 2
// output: [1,1,2,2,3,3]
export const createEvenlyRepeatedArray = <T,>(arr: T[], length: number) => {
    const result: T[] = []

    arr.forEach(element => {
        for (let i = 0; i < length; i++) {
            result.push(element)
        }
    })
    return result
}


// mockdata for service/ninchat/api.ts fetchQueue function
export const queueMockData = (length: number) => {

    const data: NinQueue['queue_transcripts'] = []

    for (let i = 0; i < length; i++) {

        // insert way out there min and max dates to test edge cases
        const date = randomNinTimeStamp(1685087493000, 1700985093000)

        data.push({
            request_time: date,
            audience_id: `audience${i}`,
            agent_id: 'null',
            customer_id: `customer${i}`,
            complete_time: date
        })
    }
    return data
}

// mockdata for service/ninchat/api.ts fetchFeedbacks function
// Mockdata is created to be deterministic, 50% of the feedbacks are pre,
// and 50% are post feedbacks.
// Every answer is ansered equally amount of times, so that
// statistics will end up being uniformally distributed.
export const feedbackMockData = (queues: NinQueue['queue_transcripts']) => {

    switch (true) {
        case queues.length % 3 !== 0:
        case queues.length % 4 !== 0:
        case queues.length % 5 !== 0:
            throw new Error(`Mock data length is not divisible by 3, 4 or 
            5 (this requirement comes from the answer options`)

    }

    const data: NinSingeFeedback[] = []

    // feeling is used on every feedback
    const feeling = createEvenlyRepeatedArray(
        ['Positiivinen', 'Neutraali', 'Negatiivinen'], queues.length / 3)

    // scale of five is used only on 50% of the times,
    // in 4 differrent metrics
    const scaleOfFive = createEvenlyRepeatedArray(
        ['Täysin samaa mieltä',
            'Jokseenkin samaa mieltä',
            'Ei samaa eikä eri mieltä',
            'Jokseenkin eri mieltä',
            'Täysin eri mieltä'],
        (queues.length / 2) * 4 / 5)

    // Source of reference is used only on 50% of the times
    const sourceOfReference = createEvenlyRepeatedArray(['Oppilaitos/opiskelijajärjestö',
        'Kaveri',
        'Sosiaalinen media',
        'Muu'], (queues.length / 2) / 4)

    // Age is used only on 50% of the times
    const age = createEvenlyRepeatedArray(
        ['18-24', '25-29', '30-35', '36-46', 'ei halua kertoa'], (queues.length / 2) / 5)

    // Gender is used only on 50% of the times
    const gender = createEvenlyRepeatedArray(
        ['Mies', 'Nainen', 'Muu', 'en halua sanoa'], (queues.length / 2) / 4)


    for (let i = 0; i < queues.length; i++) {
        const date = queues[i].complete_time

        data.push({
            audience_id: `audience${i}`,
            audience_members: {
                [randomBytes(13).toString('hex').slice(0, 13)]: {
                    customer: true
                }
            },
            audience_metadata: {
                vars: {
                    configKey: "notImportant",
                    environment: "default-reactive"
                },
                tag_ids: [],
                pre_answers: i % 2 === 0 ?
                    {
                        "Fiilis": feeling.shift()!,
                        "Sukupuoli": gender.shift()!,
                        "Ikä": age.shift()!,
                    }
                    :
                    {
                        "Fiilis": feeling.shift()!,
                        "Kokee tunteneensa yhteyttä toisiin": scaleOfFive.shift()!,
                        "Sai vertaistukea": scaleOfFive.shift()!,
                        "Kokee erillisyyden tuntemusten vähentyneen": scaleOfFive.shift()!,
                        "Voimavarat vahvistuivat": scaleOfFive.shift()!,
                        [sourceOfReference.shift()!]: 'true',
                        "Miten chat sujui": randomBytes(20).toString('hex')
                    },
                complete_time: date
            },
            event: "transcript_contents"
        })
    }
    return data
}
