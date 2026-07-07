import { Injectable, signal } from '@angular/core';
import { AiRequest, AiResponse } from '@shared/models/ai.model';
import { OcrResult } from '@shared/models/ocr.model';
import { DbQueryRequest, DbQueryResponse } from '@shared/models/sqlite.model';
import { ScreenshotMetadata } from '@shared/models/screenshot.model';
import {
  SystemVersionResponse,
  SystemPlatformResponse,
  SystemOSResponse
} from '@shared/models/system.model';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  readonly isElectron = signal<boolean>(false);
  
  // Public signal for notifications on global hotkeys
  readonly shortcutNotification = signal<string>('');

  // Public signals for holding latest captures and character recognition states
  readonly latestScreenshot = signal<ScreenshotMetadata | null>(null);
  readonly latestOcrResult = signal<OcrResult | null>(null);

  constructor() {
    const isElectronAvailable = typeof window !== 'undefined' && !!window.vysper;
    this.isElectron.set(isElectronAvailable);

    if (isElectronAvailable) {
      this.listenToShortcuts();
    }
  }

  /**
   * Subscribes to shortcut:activated event stream from Preload Bridge.
   */
  private listenToShortcuts(): void {
    window.vysper.shortcuts.onActivated((data: { shortcut: string; screenshots: ScreenshotMetadata[]; ocrResult?: OcrResult }) => {
      console.log(`[ElectronService] Received shortcut activation signal for: "${data.shortcut}"`);
      this.shortcutNotification.set('Global Shortcut Activated');

      if (data.screenshots && data.screenshots.length > 0) {
        // Find the primary screen or fallback to the first captured viewport
        const primary = data.screenshots.find(s => s.isPrimary) || data.screenshots[0];
        this.latestScreenshot.set(primary);
      }

      if (data.ocrResult) {
        console.log('[ElectronService] Received associated OCR trigger outcomes from host.');
        this.latestOcrResult.set(data.ocrResult);
      } else {
        this.latestOcrResult.set(null);
      }

      // Auto-dismiss the alert after 3 seconds
      setTimeout(() => {
        this.shortcutNotification.set('');
      }, 3000);
    });
  }

  /**
   * Safe wrapper to call Electron getVersion API
   */
  async getVersion(): Promise<string> {
    if (!this.isElectron()) {
      return 'Web Mode (No Electron)';
    }
    try {
      const result: SystemVersionResponse = await window.vysper.system.getVersion();
      return result.version;
    } catch (error) {
      console.error('[ElectronService] Error fetching system version:', error);
      throw error;
    }
  }

  /**
   * Safe wrapper to call Electron getPlatform API
   */
  async getPlatform(): Promise<string> {
    if (!this.isElectron()) {
      return 'Web Mode (Browser)';
    }
    try {
      const result: SystemPlatformResponse = await window.vysper.system.getPlatform();
      return result.platform;
    } catch (error) {
      console.error('[ElectronService] Error fetching platform:', error);
      throw error;
    }
  }

  /**
   * Safe wrapper to call Electron getOS API
   */
  async getOS(): Promise<SystemOSResponse> {
    if (!this.isElectron()) {
      return { os: 'Web Browser OS', release: 'N/A' };
    }
    try {
      const result: SystemOSResponse = await window.vysper.system.getOS();
      return result;
    } catch (error) {
      console.error('[ElectronService] Error fetching OS details:', error);
      throw error;
    }
  }

  /**
   * Safe wrapper to call programmatic screenshot capture
   */
  async captureScreenshot(): Promise<ScreenshotMetadata[]> {
    if (!this.isElectron()) {
      console.warn('[ElectronService] Electron not available. Skipping screen captures.');
      return [];
    }
    try {
      return await window.vysper.screenshot.capture();
    } catch (error) {
      console.error('[ElectronService] Error in captureScreenshot:', error);
      throw error;
    }
  }

  /**
   * Safe wrapper to execute OCR scans on a base64 image data buffer
   */
  async processOcr(imageBuffer: string): Promise<OcrResult | null> {
    if (!this.isElectron()) {
      console.warn('[ElectronService] Electron not available. Skipping OCR scan.');
      return null;
    }
    try {
      return await window.vysper.ocr.process(imageBuffer);
    } catch (error) {
      console.error('[ElectronService] Error in processOcr:', error);
      throw error;
    }
  }

  // Future scalable modular API wrappers matching window.vysper namespace
  async sendAiRequest(request: AiRequest): Promise<AiResponse | null> {
    if (!this.isElectron()) {
      return null;
    }
    try {
      return await window.vysper.ai.sendRequest(request);
    } catch (error) {
      console.error('[ElectronService] Error in sendAiRequest:', error);
      throw error;
    }
  }

  async transcribeSpeech(audioPath: string): Promise<string | null> {
    if (!this.isElectron()) {
      return null;
    }
    try {
      return await window.vysper.voice.transcribe(audioPath);
    } catch (error) {
      console.error('[ElectronService] Error in transcribeSpeech:', error);
      throw error;
    }
  }

  async queryDb<T>(request: DbQueryRequest): Promise<DbQueryResponse<T> | null> {
    if (!this.isElectron()) {
      return null;
    }
    try {
      return await window.vysper.db.query(request);
    } catch (error) {
      console.error('[ElectronService] Error in queryDb:', error);
      throw error;
    }
  }
}
