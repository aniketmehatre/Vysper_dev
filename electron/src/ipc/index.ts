import { BrowserWindow } from 'electron';
import { SystemService } from '../services/system.service';
import { ShortcutService } from '../services/shortcut.service';
import { ScreenshotService } from '../services/screenshot.service';
import { OcrService } from '../services/ocr.service';
import { registerSystemHandlers } from './system.handler';
import { registerAppHandlers } from './app.handler';
import { registerAiHandlers } from './ai.handler';
import { registerOcrHandlers } from './ocr.handler';
import { registerVoiceHandlers } from './voice.handler';
import { registerSqliteHandlers } from './sqlite.handler';
import { registerScreenshotHandlers } from './screenshot.handler';
import { registerSettingsHandlers } from './settings.handler';
import { registerShortcutHandlers } from './shortcuts.handler';

export function registerIpcHandlers(
  shortcutService: ShortcutService,
  getMainWindow: () => BrowserWindow | null
): void {
  // Instantiate host native services
  const systemService = new SystemService();
  const screenshotService = new ScreenshotService();
  const ocrService = new OcrService();

  // Register modular handlers
  registerSystemHandlers(systemService);
  registerAppHandlers();
  registerAiHandlers();
  
  // Register OCR, screenshot, and global shortcut handlers with references
  registerOcrHandlers(ocrService);
  registerScreenshotHandlers(screenshotService);
  registerShortcutHandlers(shortcutService, screenshotService, ocrService, getMainWindow);
  
  registerVoiceHandlers();
  registerSqliteHandlers();
  registerSettingsHandlers();
}
