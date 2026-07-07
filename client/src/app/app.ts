import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ElectronService } from './core/services/electron.service';

@Component({
  selector: 'app-root',
  imports: [DatePipe], // Import DatePipe to format capture timestamps in the template
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly electron = inject(ElectronService);
  protected readonly title = signal('AI Productivity Copilot');

  // Signals to hold values fetched from system IPC APIs
  protected readonly versionResult = signal<string>('');
  protected readonly platformResult = signal<string>('');
  protected readonly osResult = signal<string>('');

  /**
   * Fetches application version from system service
   */
  async fetchVersion(): Promise<void> {
    try {
      const ver = await this.electron.getVersion();
      this.versionResult.set(ver);
    } catch (err) {
      this.versionResult.set('Error loading version');
    }
  }

  /**
   * Fetches operating system platform from system service
   */
  async fetchPlatform(): Promise<void> {
    try {
      const platform = await this.electron.getPlatform();
      this.platformResult.set(platform);
    } catch (err) {
      this.platformResult.set('Error loading platform');
    }
  }

  /**
   * Fetches OS release version from system service
   */
  async fetchOS(): Promise<void> {
    try {
      const info = await this.electron.getOS();
      this.osResult.set(`OS: ${info.os} (${info.release})`);
    } catch (err) {
      this.osResult.set('Error loading OS details');
    }
  }

  /**
   * Triggers a manual screen capture programmatically and pipes the output into the OCR engine
   */
  async triggerManualCapture(): Promise<void> {
    try {
      const captures = await this.electron.captureScreenshot();
      if (captures && captures.length > 0) {
        const primary = captures.find(c => c.isPrimary) || captures[0];
        this.electron.latestScreenshot.set(primary);

        // Perform automated OCR scan on the base64 image data URI
        const ocr = await this.electron.processOcr(primary.imageBuffer);
        this.electron.latestOcrResult.set(ocr);
      }
    } catch (err) {
      console.error('[App] Manual screenshot capture or OCR chain invocation failed:', err);
    }
  }
}
