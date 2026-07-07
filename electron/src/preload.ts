import { contextBridge, ipcRenderer } from 'electron';
import { AiRequest } from '../../shared/models/ai.model';
import { DbQueryRequest } from '../../shared/models/sqlite.model';
import { ScreenshotMetadata } from '../../shared/models/screenshot.model';
import { OcrResult } from '../../shared/models/ocr.model';

// Expose a structured, secure, and typed API namespace to the renderer process
const vysperApi = {
  system: {
    getVersion: () => ipcRenderer.invoke('system:get-version'),
    getPlatform: () => ipcRenderer.invoke('system:get-platform'),
    getOS: () => ipcRenderer.invoke('system:get-os')
  },
  
  // Exposes host-to-renderer keyboard event subscriber
  shortcuts: {
    onActivated: (callback: (data: { shortcut: string; screenshots: ScreenshotMetadata[]; ocrResult?: OcrResult }) => void) => {
      const subscription = (event: any, data: { shortcut: string; screenshots: ScreenshotMetadata[]; ocrResult?: OcrResult }) => callback(data);
      ipcRenderer.on('shortcut:activated', subscription);
      
      // Return a cleanup function to prevent memory leaks in Angular component lifecycles
      return () => {
        ipcRenderer.removeListener('shortcut:activated', subscription);
      };
    }
  },

  screenshot: {
    // Invoke programmatic screenshot capture returning an array of screenshot metadata
    capture: (): Promise<ScreenshotMetadata[]> => ipcRenderer.invoke('screenshot:capture')
  },

  ocr: {
    // Invoke programmatic character extraction on an image buffer
    process: (imageBuffer: string): Promise<OcrResult> => ipcRenderer.invoke('ocr:process-image', imageBuffer)
  },
  
  // Placeholders for future feature bridges to maintain clean namespace scaling
  ai: {
    sendRequest: (request: AiRequest) => ipcRenderer.invoke('ai:chat-response', request)
  },
  
  voice: {
    transcribe: (audioPath: string) => ipcRenderer.invoke('speech:transcribe', audioPath)
  },
  
  db: {
    query: (request: DbQueryRequest) => ipcRenderer.invoke('db:query', request)
  }
};

// Bind to window.vysper
contextBridge.exposeInMainWorld('vysper', vysperApi);

export type VysperAPI = typeof vysperApi;
