export const IPC_EVENTS = {
  // App Window Controls
  APP_MINIMIZE: 'app:minimize',
  APP_MAXIMIZE: 'app:maximize',
  APP_CLOSE: 'app:close',
  APP_GET_VERSION: 'app:get-version',

  // AI Integration
  AI_CHAT_STREAM: 'ai:chat-stream',
  AI_CHAT_RESPONSE: 'ai:chat-response',

  // OCR Service
  OCR_PROCESS_IMAGE: 'ocr:process-image',

  // Speech Recognition
  SPEECH_TRANSCRIBE: 'speech:transcribe',

  // SQLite Database
  DB_EXECUTE: 'db:execute',
  DB_QUERY: 'db:query',

  // Global Shortcuts
  SHORTCUT_ACTIVATED: 'shortcut:activated'
} as const;

export type IpcChannel = typeof IPC_EVENTS[keyof typeof IPC_EVENTS];
