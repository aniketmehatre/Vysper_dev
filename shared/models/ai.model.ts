export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AiRequest {
  provider: 'ollama' | 'gemini' | 'openai';
  model: string;
  messages: ChatMessage[];
  options?: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  };
}

export interface AiResponse {
  message: ChatMessage;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AiStreamChunk {
  content: string;
  done: boolean;
  error?: string;
}
