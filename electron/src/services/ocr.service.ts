import { OcrResult } from '../../../shared/models/ocr.model';

export class OcrService {
  /**
   * Evaluates base64 captured screen PNG data and extracts characters and confidence metrics.
   */
  async extractText(imageBuffer: string): Promise<OcrResult> {
    const startTime = Date.now();
    console.log(`[OcrService] Processing image buffer: ${imageBuffer.substring(0, 50)}... (length: ${imageBuffer.length})`);

    // Basic layout verification
    if (!imageBuffer || !imageBuffer.startsWith('data:image/png;base64,')) {
      console.warn('[OcrService] Image buffer check failed or is empty.');
      return {
        text: '',
        confidence: 0,
        processingTimeMs: Date.now() - startTime,
        boundingBoxes: []
      };
    }

    // Simulate character mapping processing time (200ms)
    await new Promise(resolve => setTimeout(resolve, 200));

    const processingTimeMs = Date.now() - startTime;

    // Standard OCR returned mock data for testing sandbox dispatches
    const extractedText = 'Vysper AI Desktop Copilot\nClean Architecture & SOLID Principles active.\nGlobal Shortcut triggered: Ctrl + Shift + Space.\nScreenshot captured natively and sent to OcrService in-memory.';

    return {
      text: extractedText,
      confidence: 0.96,
      processingTimeMs,
      boundingBoxes: [
        { text: 'Vysper AI', confidence: 0.99, x: 10, y: 10, width: 120, height: 20 },
        { text: 'SOLID', confidence: 0.98, x: 10, y: 40, width: 80, height: 20 },
        { text: 'IPC Engine', confidence: 0.95, x: 10, y: 70, width: 100, height: 20 }
      ]
    };
  }
}
