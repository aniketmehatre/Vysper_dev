import { desktopCapturer, screen } from 'electron';
import { ScreenshotMetadata } from '../../../shared/models/screenshot.model';

export class ScreenshotService {
  /**
   * Captures all connected monitor displays and returns details about each screen.
   */
  async captureAllScreens(): Promise<ScreenshotMetadata[]> {
    try {
      const displays = screen.getAllDisplays();
      
      // Determine the maximum bounds of monitors to request full native size
      const maxWidth = Math.max(...displays.map(d => d.bounds.width));
      const maxHeight = Math.max(...displays.map(d => d.bounds.height));

      // Fetch captures matching viewports
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: maxWidth || 1920,
          height: maxHeight || 1080
        }
      });

      const timestamp = Date.now();
      const screenshots: ScreenshotMetadata[] = [];
      const primaryDisplay = screen.getPrimaryDisplay();

      for (let i = 0; i < displays.length; i++) {
        const display = displays[i];
        
        // Find matching source display (falls back to index 0 if display indices shift)
        const source = sources[i] || sources[0];
        if (source) {
          const nativeImage = source.thumbnail;
          const size = nativeImage.getSize();
          
          // Convert binary raw image buffer to PNG Base64 String
          const base64Data = nativeImage.toPNG().toString('base64');
          const dataUri = `data:image/png;base64,${base64Data}`;

          screenshots.push({
            width: size.width,
            height: size.height,
            timestamp,
            imageBuffer: dataUri,
            displayId: display.id,
            isPrimary: display.id === primaryDisplay.id
          });
        }
      }

      console.log(`[ScreenshotService] Captured ${screenshots.length} monitor screens.`);
      return screenshots;
    } catch (error) {
      console.error('[ScreenshotService] Error capturing monitors:', error);
      throw new Error('Failed to run screenshot captures.');
    }
  }
}
