import { contextBridge, ipcRenderer } from 'electron';
import { DateRangePipeProp } from '../main/events';
import {
  Credentials,
  NinServerMeta,
  PostFeedBackQuestionSummary,
  PreFeedBackStatsSummary
} from '../types';
import { PrefillProps } from 'src/renderer/src/components/ModalNewLog/steps/Prefill';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer

const dateBarAPI = {
  dateBarHighlights: (): Promise<string[]> => ipcRenderer.invoke('date_highlights')
};

const logPageAPI = {
  loadState: (credentials: Credentials, header: PrefillProps['values']): Promise<NinServerMeta> =>
    ipcRenderer.invoke('newlog_load_state', credentials, header),
  processState: (): Promise<boolean> => ipcRenderer.invoke('newlog_process_state')
};

const summaryPageAPI = {

  logSummary: (): Promise<void> => ipcRenderer.invoke('log_summary'),
  summaryPreFeedback: (dates: DateRangePipeProp): Promise<PreFeedBackStatsSummary> =>
    ipcRenderer.invoke('summary_preFeedback', dates),
  postFeedBack: (dates: DateRangePipeProp, closed = false): Promise<PostFeedBackQuestionSummary> =>
    ipcRenderer.invoke('summary_postFeedbackClosed', dates, closed)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
// Context isolation is preferred highly preferred. 
// ElectronAPI is used for fetching the app versions.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('logAPI', logPageAPI);
    contextBridge.exposeInMainWorld('summaryAPI', summaryPageAPI);
    contextBridge.exposeInMainWorld('dateBarAPI', dateBarAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.logAPI = logPageAPI;
  // @ts-ignore (define in dts)
  window.summaryAPI = summaryPageAPI;
  // @ts-ignore (define in dts)
  window.dateBarAPI = dateBarAPI;
// @ts-ignore (define in dts)
  window.electron = electronAPI;
}
