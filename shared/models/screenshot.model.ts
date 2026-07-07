export interface ScreenshotMetadata {
  width: number;
  height: number;
  timestamp: number;
  imageBuffer: string; // Base64 Data URI: data:image/png;base64,...
  displayId: number;
  isPrimary: boolean;
}
