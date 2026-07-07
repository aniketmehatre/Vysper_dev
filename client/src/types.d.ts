import { VysperAPI } from '../../electron/src/preload';

declare global {
  interface Window {
    vysper: VysperAPI;
  }
}
