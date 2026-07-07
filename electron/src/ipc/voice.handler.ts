import { ipcMain } from 'electron';
import { IPC_EVENTS } from '../../../shared/ipc-events';

export function registerVoiceHandlers(): void {
  ipcMain.handle(IPC_EVENTS.SPEECH_TRANSCRIBE, async (event, audioPath: string) => {
    try {
      console.log('[Electron Voice Handler] Transcribing path:', audioPath);
      return 'Mock audio transcript';
    } catch (error) {
      console.error('Error in Voice IPC handler:', error);
      throw new Error('Speech transcription failed');
    }
  });
}
