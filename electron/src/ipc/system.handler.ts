import { ipcMain } from 'electron';
import { SystemService } from '../services/system.service';

export function registerSystemHandlers(systemService: SystemService): void {
  ipcMain.handle('system:get-version', () => {
    return systemService.getVersion();
  });

  ipcMain.handle('system:get-platform', () => {
    return systemService.getPlatform();
  });

  ipcMain.handle('system:get-os', () => {
    return systemService.getOS();
  });
}
