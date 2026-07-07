import { ipcMain } from 'electron';
import { OcrService } from '../services/ocr.service';

/**
 * Maps program-triggered character recognition calls to the host OcrService.
 */
export function registerOcrHandlers(ocrService: OcrService): void {
  ipcMain.handle('ocr:process-image', async (event, imageBuffer: string) => {
    try {
      console.log('[OcrHandler] Invoking programmatic character extraction...');
      return await ocrService.extractText(imageBuffer);
    } catch (error) {
      console.error('[OcrHandler] Error in ocr:process-image IPC channel:', error);
      throw new Error('OCR character recognition failed.');
    }
  });
}
