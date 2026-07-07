import { ipcMain } from 'electron';

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:get', async (event, key: string) => {
    try {
      console.log('[Electron Settings Handler] Get config for:', key);
      return null;
    } catch (error) {
      console.error('Error in Settings IPC handler:', error);
      throw new Error('Retrieve settings failed');
    }
  });

  ipcMain.handle('settings:set', async (event, key: string, val: any) => {
    try {
      console.log('[Electron Settings Handler] Set config:', key, val);
      return { success: true };
    } catch (error) {
      console.error('Error in Settings IPC handler:', error);
      throw new Error('Update settings failed');
    }
  });
}
