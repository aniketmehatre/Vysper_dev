import { contextBridge, ipcRenderer } from 'electron';
import { IPC_EVENTS } from '../../shared/ipc-events';
import { AiRequest } from '../../shared/models/ai.model';
import { DbQueryRequest } from '../../shared/models/sqlite.model';

const api = {
  minimize: () => ipcRenderer.send(IPC_EVENTS.APP_MINIMIZE),
  maximize: () => ipcRenderer.send(IPC_EVENTS.APP_MAXIMIZE),
  close: () => ipcRenderer.send(IPC_EVENTS.APP_CLOSE),
  getVersion: () => ipcRenderer.invoke(IPC_EVENTS.APP_GET_VERSION),

  // AI services
  sendAiRequest: (request: AiRequest) => ipcRenderer.invoke(IPC_EVENTS.AI_CHAT_RESPONSE, request),

  // OCR
  processImage: (imagePath: string) => ipcRenderer.invoke(IPC_EVENTS.OCR_PROCESS_IMAGE, imagePath),

  // Speech
  transcribeSpeech: (audioPath: string) => ipcRenderer.invoke(IPC_EVENTS.SPEECH_TRANSCRIBE, audioPath),

  // SQLite Database
  queryDb: (request: DbQueryRequest) => ipcRenderer.invoke(IPC_EVENTS.DB_QUERY, request)
};

// Expose the API to the window object under the 'ai' namespace
contextBridge.exposeInMainWorld('ai', api);

export type ElectronAPI = typeof api;
