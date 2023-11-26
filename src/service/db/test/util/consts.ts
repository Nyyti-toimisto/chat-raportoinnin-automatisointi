import { NinQueue, NinSingeFeedback } from "../../../../types"
import { randomBytes } from "crypto"

// ninchat uses time in seconds not milliseconds
function randomNinTimeStamp(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min) / 1000
}

const randomFromArray = <T,>(arr: T[]) => {
    return arr[~~(Math.random() * arr.length)]
}

// mockdata for service/ninchat/api.ts fetchQueue function
export const queueMockData = (length = 10) => {

    const data: NinQueue['queue_transcripts'] = []

    for (let i = 0; i < length; i++) {


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
export const feedbackMockData = (length = 10) => {

    const data: NinSingeFeedback[] = []

    for (let i = 0; i < length; i++) {


        const date = randomNinTimeStamp(1685087493000, 1700985093000)
        const feeling = ['Positiivinen', 'Neutraali', 'Negatiivinen']
        const scaleOfFive = ['Täysin samaa mieltä',
            'Jokseenkin samaa mieltä',
            'Ei samaa eikä eri mieltä',
            'Jokseenkin eri mieltä',
            'Täysin eri mieltä']

        const sourceOfReference = ['Oppilaitos/opiskelijajärjestö',
            'Kaveri',
            'Sosiaalinen media',
            'Muu']

        const age = ['18-24','25-29','30-35','36-46','ei halua kertoa']
        const gender = ['Mies','Nainen','ei halua kertoa']

        data.push({
            audience_id: `audience${i}`,
            audience_members: {
                [randomBytes(13).toString('hex').slice(0,13)]: {
                    customer: true
                }
            },
            audience_metadata: {
                vars: {
                    configKey: "notImportant",
                    environment: "default-reactive"
                },
                tag_ids: [],
                pre_answers: Math.random() > 0.3 ? 
                {
                    "Fiilis": randomFromArray(feeling),
                    "Sukupuoli": randomFromArray(gender),
                    "Ikä": randomFromArray(age),
                } 
                :
                {
                    "Fiilis": randomFromArray(feeling),
                    "Kokee tunteneensa yhteyttä toisiin": randomFromArray(scaleOfFive),
                    "Sai vertaistukea": randomFromArray(scaleOfFive),
                    "Kokee erillisyyden tuntemusten vähentyneen": randomFromArray(scaleOfFive),
                    "Voimavarat vahvistuivat": randomFromArray(scaleOfFive),
                    [randomFromArray(sourceOfReference)]: 'true',
                    "Miten chat sujui": randomBytes(20).toString('hex')
                },
                complete_time: date
            },
            event: "transcript_contents"
        })
    }
    return data
}
