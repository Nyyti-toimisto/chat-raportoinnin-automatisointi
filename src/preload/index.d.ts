import { ElectronAPI } from '@electron-toolkit/preload';
import {
  Credentials,
  LogSummaryRecord,
  NinServerMeta,
  PostFeedBackQuestionSummary,
  PreFeedBackStatsSummary,
  TChatSessionRecord
} from '../types';
import { DateRangePipeProp } from '../main/events';
import { PrefillProps } from '@renderer/components/ModalNewLog/steps/Prefill';

declare global {
  interface Window {
    electron: ElectronAPI;
    dateBarAPI: {
      dateBarHighlights: () => Promise<string[]>;
    };
    logAPI: {
      loadState: (credentials: Credentials, header: PrefillProps['values']) => Promise<NinServerMeta>;
      processState: () => Promise<boolean>;
    };
    summaryAPI: {
      testInvoke: () => Promise<TChatSessionRecord[]>;
      logSummary: () => Promise<void>;
      summaryPreFeedback: (dates: DateRangePipeProp) => Promise<PreFeedBackStatsSummary>;
      postFeedBack: (
        dates: DateRangePipeProp,
        closed: boolean
      ) => Promise<PostFeedBackQuestionSummary[]>;
    };
  }
}
