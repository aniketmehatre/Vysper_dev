import { registerAppHandlers } from './app.handler';
import { registerAiHandlers } from './ai.handler';
import { registerOcrHandlers } from './ocr.handler';
import { registerVoiceHandlers } from './voice.handler';
import { registerSqliteHandlers } from './sqlite.handler';
import { registerScreenshotHandlers } from './screenshot.handler';
import { registerSettingsHandlers } from './settings.handler';
import { registerShortcutsHandlers } from './shortcuts.handler';

export function registerIpcHandlers(): void {
  registerAppHandlers();
  registerAiHandlers();
  registerOcrHandlers();
  registerVoiceHandlers();
  registerSqliteHandlers();
  registerScreenshotHandlers();
  registerSettingsHandlers();
  registerShortcutsHandlers();
}
