import { PostFeedBackQuestionSummary } from "src/types";


export const separateBooleanAnswers =
    (postFeedbacks: PostFeedBackQuestionSummary[]) => {

        if (postFeedbacks.length === 0) {
            return []
        }

        const booleansFiltered = postFeedbacks.filter((feedback) => {
            if (Object.keys(feedback.answers).length === 1
                && Object.values(feedback.answers)[0].answer === '1') {
                return feedback
            }
            return
        })

        const booleanStructrued = [{
            question_hash: 'BooleanQuestions',
            question: 'Monivalintakysymykset',
            answers: booleansFiltered.reduce((acc, val) => {
                const hash = val.question_hash
    
                if (!acc[hash]) {
                    acc[hash] = {answer: val.question, count: Object.values(val.answers)[0].count}
                }
                return acc
            }, {})
        }]


        const booleanKeys = booleansFiltered.map((feedback) => feedback.question_hash)
        const otherAnswers = postFeedbacks.filter((feedback) => {
            if (!booleanKeys.includes(feedback.question_hash)) {
                return feedback
            }
            return
        })

        return booleanStructrued.concat(otherAnswers)
    }   