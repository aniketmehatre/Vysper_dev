import { ipcMain, BrowserWindow } from 'electron';
import { IPC_EVENTS } from '../../../shared/ipc-events';
import { ShortcutService } from '../services/shortcut.service';
import { ScreenshotService } from '../services/screenshot.service';
import { OcrService } from '../services/ocr.service';

/**
 * Registers global keyboard shortcuts and handles dynamic updates, screen capture, and OCR triggers.
 */
export function registerShortcutHandlers(
  shortcutService: ShortcutService,
  screenshotService: ScreenshotService,
  ocrService: OcrService,
  getMainWindow: () => BrowserWindow | null
): void {
  // Dynamic registration API (enabling future settings customizations)
  ipcMain.handle('shortcuts:register-custom', async (event, accelerator: string) => {
    try {
      console.log(`[ShortcutsHandler] Attempting custom registration for: "${accelerator}"`);
      return bindShortcut(accelerator, shortcutService, screenshotService, ocrService, getMainWindow);
    } catch (error) {
      console.error(`[ShortcutsHandler] Custom registration failed for "${accelerator}":`, error);
      throw new Error(`Failed to register custom shortcut: ${accelerator}`);
    }
  });

  // Bind the default keybind on start
  const defaultShortcut = 'Ctrl+Shift+Space';
  bindShortcut(defaultShortcut, shortcutService, screenshotService, ocrService, getMainWindow);
}

/**
 * Core binder registering key to capture screens, extract text, and dispatch an IPC signal when clicked.
 */
function bindShortcut(
  accelerator: string,
  shortcutService: ShortcutService,
  screenshotService: ScreenshotService,
  ocrService: OcrService,
  getMainWindow: () => BrowserWindow | null
): boolean {
  return shortcutService.register(accelerator, async () => {
    console.log(`[ShortcutsHandler] Global shortcut activated: "${accelerator}". Triggering screen captures...`);
    try {
      const screenshots = await screenshotService.captureAllScreens();
      if (screenshots && screenshots.length > 0) {
        // Retrieve primary display or fallback
        const primary = screenshots.find(s => s.isPrimary) || screenshots[0];
        
        console.log('[ShortcutsHandler] Forwarding primary capture buffer directly to OcrService in-memory...');
        const ocrResult = await ocrService.extractText(primary.imageBuffer);

        const win = getMainWindow();
        if (win) {
          win.webContents.send(IPC_EVENTS.SHORTCUT_ACTIVATED, {
            shortcut: accelerator,
            screenshots,
            ocrResult
          });
        }
      } else {
        console.warn('[ShortcutsHandler] No viewports captured, skipping OCR step.');
      }
    } catch (error) {
      console.error('[ShortcutsHandler] Error executing Shortcut-Capture-OCR pipeline:', error);
    }
  });
}
