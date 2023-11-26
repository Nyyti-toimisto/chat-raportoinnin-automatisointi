import { RangeValue } from './renderer/src/components/DateBar/DateBar';

//TODO: organize types and get rid of overlaps

export type TChatSessionRecord = {
  id?: string;
  chat_date: string;
  created?: string;
  topic: string;
  hosts: string;
  participant_count: number;
  comments_from_host: string;
  details: string;
};

export type DaoLogger = {
  (tableName: string, message: string, error?: boolean): void;
};

export type FeedbackPreEntry = {
  user_id: string;
  feeling: string;
  gender: string;
  age: string;
  date_submitted: string;
};

export type FeedbackPostEntry = {
  user_id: string;
  question: string;
  answer: string;
  date_submitted: string;
};

export type FeedbackAnswerRecord = {
  hash: string;
  date_created: Date;
  answer: string;
};

export type FeedbackQuestionRecord = {
  hash: string;
  date_created: Date;
  question: string;
};

export type LogSummaryBaseStats = {
  session_count: number;
  total_participants: number;
  pre_feedback_count: number;
  post_feedback_count: number;
};
export type OldestOrNewestRecord = {
  chat_date: string;
  hosts: string;
} & LogSummaryBaseStats;

export type LogSummaryRecord = {
  oldest: OldestOrNewestRecord;
  newest: OldestOrNewestRecord;
  session_count: number;
  total_participants: number;
  pre_feedback_count: number;
  post_feedback_count: number;
};

export type PreFeedBackRecord = {
  id: number;
  chat_date: string;
  user_id: string;
  date_submitted: string;
  feeling: string;
  gender: string;
  age: string;
};

export type FeelsStats = {
  positive: number;
  negative: number;
  neutral: number;
};

export type AgeStats = {
  '18-24': number;
  '25-29': number;
  '30-35': number;
  '36-46': number;
  'Ei sano': number;
};
export type GenderStats = {
  male: number;
  female: number;
  other: number;
  unknow: number;
};

export type ChartingData = {
  feel: {
    week: number;
    year: number;
    feeling: string;
    id: number;
  }[];
};

export type PreFeedBackStatsSummary = {
  range: {
    start: string;
    end: string;
  };
  feels: FeelsStats;
  age: AgeStats;
  gender: GenderStats;
  chart: ChartingData;
};

export type PostFeedBackRecord = {
  date_submitted: string;
  id: number;
  user_id: string;
  q_hash: string;
  a_hash: string;
  question: string;
  answer: string;
};

export type PostFeedBackAnswerSummary = {
  [key: string | number]: {
    answer: string;
    count: number;
  };
};

export type PostFeedBackQuestionSummary = {
  question_hash: string;
  question: string;
  answers: PostFeedBackAnswerSummary;
};

export type DateProps = {
  dates: RangeValue;
};

export type Credentials = {
  username: string;
  password: string;
};

export type NinQueue = {
  event: string;
  queue_id: string;
  queue_transcripts: {
    request_time: number;
    audience_id: string;
    agent_id: string;
    customer_id: string;
    complete_time: number;
  }[];
};

export type NinServerMeta = {
  count: number;
  dates: {
    min: string;
    max: string;
  };
  userCount: number;
};

export type NinSingeFeedback = {
  audience_id: string;
  audience_members:{
    [key: string]: {
      customer: boolean
    }}
  audience_metadata:{
    vars:{
      configKey: string;
      environment: string;
    },
    tag_ids: string[];
    pre_answers: {
      [key: string]: string;
    },
    complete_time?: number; // a hack for carrying on the feedback given time to database
  },
  event: string;
  }