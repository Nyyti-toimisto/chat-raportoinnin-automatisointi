import { PostFeedBackQuestionSummary, PostFeedBackRecord, PreFeedBackRecord } from 'src/types';

type QuestionsGrouped = {
  answer_hash: string;
  question: string;
  answer: string;
};

export const groupQuestions = (arr: PostFeedBackRecord[]) => {
  return arr.reduce<Record<string, QuestionsGrouped[]>>(function (obj, record) {
    const q = record.q_hash;

    if (!Object.prototype.hasOwnProperty.call(obj, q)) {
      obj[q] = [];
    }

    obj[q].push({
      question: record.question,
      answer: record.answer,
      answer_hash: record.a_hash
    });

    return obj;
  }, {});
};

export const groupAndCountAnswers = (questionSet: Record<string, QuestionsGrouped[]>) => {
  const response: PostFeedBackQuestionSummary[] = [];

  for (const key of Object.keys(questionSet)) {
    const answersGrouped = questionSet[key].reduce<
      Record<string, { answer: string; count: number }>
    >(function (obj, record) {
      const a = record.answer_hash;

      if (!Object.prototype.hasOwnProperty.call(obj, a)) {
        obj[a] = { answer: record.answer, count: 0 };
      }

      obj[a].count += 1;

      return obj;
    }, {});

    response.push({
      question_hash: key,
      question: questionSet[key][0].question,
      answers: answersGrouped
    });
  }

  return response
};

export const edgeDate = (arr: PreFeedBackRecord[], whichEdge: 'min' | 'max') => {
  try {
    const date =
      whichEdge == 'min'
        ? new Date(
            Math.min(
              ...arr.map((element) => {
                return new Date(element.date_submitted).getTime();
              })
            )
          ).toISOString()
        : new Date(
            Math.max(
              ...arr.map((element) => {
                return new Date(element.date_submitted).getTime();
              })
            )
          ).toISOString();

    return date;
  } catch (error) {
    console.log('edgeDate error', error);
    return new Date(2000, 0, 1).toISOString();
  }
};

export const epochToISO = (epoch: number) => {
  return new Date(epoch * 1000).toISOString();
}

export const mapPreFeedBack = (obj: {[key:string]:string}) => {
    
    const feeling = obj['Fiilis'].charAt(0).toUpperCase() + obj['Fiilis'].slice(1);
    const gender = obj['Sukupuoli'].charAt(0).toUpperCase() + obj['Sukupuoli'].slice(1);
    const age = obj['Ikä'].charAt(0).toUpperCase() + obj['Ikä'].slice(1);
    return {feeling, gender, age}

}



