import { ipcMain } from 'electron';
import { sessionTable, testReader, testWriter } from '.';

// ipcMain listeners are defined in preload. They need to be invoked before they can be handled.
// This is a security feature of Electron.
// See preload/index.ts for the corresponding exposure.
// See https://www.electronjs.org/docs/tutorial/context-isolation#preload-scripts

export type DateRangePipeProp = {
  start?: string;
  end?: string;
};

export const registerHandles = () => {
  ipcMain.handle('test-invoke', async () => {
    return sessionTable.getAll();
  });

  ipcMain.handle('log_summary', () => {
    return testReader.getLogPageSummary();
  });

  ipcMain.handle('summary_preFeedback', (_, dates: DateRangePipeProp) => {
    return testReader.getPreFeedbackStats(dates);
  });

  ipcMain.handle('summary_postFeedbackClosed', (_, dates: DateRangePipeProp, closed: boolean) => {
    return testReader.getPostFeedback(dates, closed);
  });

  ipcMain.handle('date_highlights', () => {
    return testReader.getDateBarHighlights();
  });

  ipcMain.handle('newlog_load_state', (_, credentials, header) => {
    return testWriter.setState(credentials, header);
  });

  ipcMain.handle('newlog_process_state', () => {
    return testWriter.processState();
  });

};