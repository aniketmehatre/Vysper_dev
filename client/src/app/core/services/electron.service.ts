import { Injectable, signal } from '@angular/core';
import { AiRequest, AiResponse } from '@shared/models/ai.model';
import { OcrResult } from '@shared/models/ocr.model';
import { DbQueryRequest, DbQueryResponse } from '@shared/models/sqlite.model';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  readonly isElectron = signal<boolean>(false);
  readonly appVersion = signal<string>('0.0.0');

  constructor() {
    const isElectronAvailable = typeof window !== 'undefined' && !!window.ai;
    this.isElectron.set(isElectronAvailable);
    
    if (isElectronAvailable) {
      this.loadAppVersion();
    }
  }

  private async loadAppVersion(): Promise<void> {
    try {
      const version = await window.ai.getVersion();
      this.appVersion.set(version);
    } catch (error) {
      console.error('[ElectronService] Failed to retrieve app version:', error);
      this.appVersion.set('Error Loading');
    }
  }

  // App Window Operations
  minimize(): void {
    if (this.isElectron()) {
      try {
        window.ai.minimize();
      } catch (error) {
        console.error('[ElectronService] Error invoking minimize:', error);
      }
    }
  }

  maximize(): void {
    if (this.isElectron()) {
      try {
        window.ai.maximize();
      } catch (error) {
        console.error('[ElectronService] Error invoking maximize:', error);
      }
    }
  }

  close(): void {
    if (this.isElectron()) {
      try {
        window.ai.close();
      } catch (error) {
        console.error('[ElectronService] Error invoking close:', error);
      }
    }
  }

  // AI service
  async sendAiRequest(request: AiRequest): Promise<AiResponse | null> {
    if (!this.isElectron()) {
      console.warn('[ElectronService] Electron is not available. Skipping AI request...');
      return null;
    }
    try {
      return await window.ai.sendAiRequest(request);
    } catch (error) {
      console.error('[ElectronService] Error invoking sendAiRequest:', error);
      throw error;
    }
  }

  // OCR Service
  async processImage(imagePath: string): Promise<OcrResult | null> {
    if (!this.isElectron()) {
      console.warn('[ElectronService] Electron is not available. Skipping OCR scan...');
      return null;
    }
    try {
      return await window.ai.processImage(imagePath);
    } catch (error) {
      console.error('[ElectronService] Error invoking processImage:', error);
      throw error;
    }
  }

  // Speech Recognition
  async transcribeSpeech(audioPath: string): Promise<string | null> {
    if (!this.isElectron()) {
      console.warn('[ElectronService] Electron is not available. Skipping Speech Transcription...');
      return null;
    }
    try {
      return await window.ai.transcribeSpeech(audioPath);
    } catch (error) {
      console.error('[ElectronService] Error invoking transcribeSpeech:', error);
      throw error;
    }
  }

  // SQLite Database execution
  async queryDb<T>(request: DbQueryRequest): Promise<DbQueryResponse<T> | null> {
    if (!this.isElectron()) {
      console.warn('[ElectronService] Electron is not available. Skipping DB query...');
      return null;
    }
    try {
      return await window.ai.queryDb(request);
    } catch (error) {
      console.error('[ElectronService] Error invoking queryDb:', error);
      throw error;
    }
  }
}
