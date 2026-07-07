import { ipcMain } from 'electron';
import { ScreenshotService } from '../services/screenshot.service';

/**
 * Maps program-triggered screen captures to the host ScreenshotService.
 */
export function registerScreenshotHandlers(screenshotService: ScreenshotService): void {
  ipcMain.handle('screenshot:capture', async () => {
    try {
      console.log('[ScreenshotHandler] Invoking programmatic screen capture...');
      return await screenshotService.captureAllScreens();
    } catch (error) {
      console.error('[ScreenshotHandler] Error during programmatic capture invocation:', error);
      throw new Error('Screenshot capture operation failed.');
    }
  });
}
