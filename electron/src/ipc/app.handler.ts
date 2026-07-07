import { ipcMain, app, BrowserWindow } from 'electron';
import { IPC_EVENTS } from '../../../shared/ipc-events';

export function registerAppHandlers(): void {
  const getMainWindow = (): BrowserWindow | null => {
    const windows = BrowserWindow.getAllWindows();
    return windows.length > 0 ? windows[0] : null;
  };

  ipcMain.on(IPC_EVENTS.APP_MINIMIZE, () => {
    getMainWindow()?.minimize();
  });

  ipcMain.on(IPC_EVENTS.APP_MAXIMIZE, () => {
    const win = getMainWindow();
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });

  ipcMain.on(IPC_EVENTS.APP_CLOSE, () => {
    getMainWindow()?.close();
  });

  ipcMain.handle(IPC_EVENTS.APP_GET_VERSION, () => {
    try {
      return app.getVersion();
    } catch (error) {
      console.error('Error getting app version in IPC handler:', error);
      throw new Error('Failed to retrieve app version');
    }
  });
}
