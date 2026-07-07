import { ipcMain } from 'electron';
import { IPC_EVENTS } from '../../../shared/ipc-events';

export function registerOcrHandlers(): void {
  ipcMain.handle(IPC_EVENTS.OCR_PROCESS_IMAGE, async (event, imagePath: string) => {
    try {
      console.log('[Electron OCR Handler] Processing path:', imagePath);
      return {
        text: 'Mock OCR text results',
        confidence: 0.98,
        boundingBoxes: []
      };
    } catch (error) {
      console.error('Error in OCR IPC handler:', error);
      throw new Error('OCR image scanning failed');
    }
  });
}
