import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { registerHandles } from './events';
import { Dao, createTables, daoLogger } from '../service/db/dao';
import { WriteController } from '../service/db/interfaces/WriteController';
import { ReadController } from '../service/db/interfaces/ReadController';

export let filepath = '';
export let dao: Dao;
export let testWriter: WriteController;
export let testReader: ReadController;

registerHandles();

function createWindow(): void {
    // Create the browser window.

    const mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        minWidth: 900,
        show: true,
        autoHideMenuBar: false,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            contextIsolation: true
        }
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron');

    ipcMain.handle('dialog:openFile', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            filters: [{ name: 'Database', extensions: ['.db'] }],
            properties: ['openFile']
        });
        if (canceled || filePaths[0] === filepath) {
            return false;
        }
        // close db
        if (filePaths.length === 1 && dao) {
            dao.db.close((err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        // open new db
        filepath = filePaths[0];
        dao = new Dao(filePaths[0], daoLogger);
        const { feedbackPreTable, feedbackPostTable } = createTables(dao);

        testWriter = new WriteController(feedbackPreTable, feedbackPostTable);
        testReader = new ReadController(dao);
        return true;
    });
    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });
    setTimeout(() => {
        createWindow();
    }, 900);

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    dao.db.close((err) => {
        if (err) {
            console.log(err);
        }
    });
});
