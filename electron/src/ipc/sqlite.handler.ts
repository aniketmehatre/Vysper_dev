import { ipcMain } from 'electron';
import { IPC_EVENTS } from '../../../shared/ipc-events';
import { DbQueryRequest } from '../../../shared/models/sqlite.model';

export function registerSqliteHandlers(): void {
  ipcMain.handle(IPC_EVENTS.DB_QUERY, async (event, request: DbQueryRequest) => {
    try {
      console.log('[Electron SQLite Handler] Executing SQL:', request.sql);
      return {
        success: true,
        data: []
      };
    } catch (error) {
      console.error('Error in SQLite IPC handler:', error);
      throw new Error('Database query execution failed');
    }
  });
}
