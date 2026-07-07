import { app } from 'electron';
import * as os from 'os';
import {
  SystemVersionResponse,
  SystemPlatformResponse,
  SystemOSResponse
} from '../../../shared/models/system.model';

export class SystemService {
  /**
   * Retrieves the current application version from Electron.
   */
  getVersion(): SystemVersionResponse {
    try {
      return { version: app.getVersion() };
    } catch (error) {
      console.error('[SystemService] Error getting version:', error);
      throw new Error('Failed to get system version');
    }
  }

  /**
   * Retrieves the operating system platform name (e.g. 'win32', 'darwin').
   */
  getPlatform(): SystemPlatformResponse {
    try {
      return { platform: process.platform };
    } catch (error) {
      console.error('[SystemService] Error getting platform:', error);
      throw new Error('Failed to get platform name');
    }
  }

  /**
   * Retrieves detail about the OS type and kernel release version.
   */
  getOS(): SystemOSResponse {
    try {
      return {
        os: os.type(),
        release: os.release()
      };
    } catch (error) {
      console.error('[SystemService] Error getting OS details:', error);
      throw new Error('Failed to get OS details');
    }
  }
}
