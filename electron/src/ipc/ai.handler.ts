import { ipcMain } from 'electron';
import { IPC_EVENTS } from '../../../shared/ipc-events';
import { AiRequest } from '../../../shared/models/ai.model';

export function registerAiHandlers(): void {
  ipcMain.handle(IPC_EVENTS.AI_CHAT_RESPONSE, async (event, request: AiRequest) => {
    try {
      console.log('[Electron AI Handler] Received request:', request);
      return {
        message: {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: `Mock AI response from sandbox. Provider: ${request.provider}`,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      console.error('Error in AI IPC handler:', error);
      throw new Error('AI request processing failed');
    }
  });
}
