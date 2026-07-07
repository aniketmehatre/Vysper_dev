import { ipcMain } from 'electron';

export function registerShortcutsHandlers(): void {
  ipcMain.handle('shortcuts:register', async (event, accelerator: string) => {
    try {
      console.log('[Electron Shortcuts Handler] Register shortcut:', accelerator);
      return { success: true };
    } catch (error) {
      console.error('Error in Shortcuts IPC handler:', error);
      throw new Error('Shortcut registration failed');
    }
  });
}
