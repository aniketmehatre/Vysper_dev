import { ElectronAPI } from '../../electron/src/preload';

declare global {
  interface Window {
    ai: ElectronAPI;
  }
}
