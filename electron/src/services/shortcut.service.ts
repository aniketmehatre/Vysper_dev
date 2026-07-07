import { globalShortcut } from 'electron';

export class ShortcutService {
  private shortcuts = new Map<string, () => void>();

  /**
   * Registers a global keyboard shortcut with a callback.
   * Returns true if registration was successful.
   */
  register(accelerator: string, callback: () => void): boolean {
    if (globalShortcut.isRegistered(accelerator)) {
      console.warn(`[ShortcutService] Accelerator "${accelerator}" is already registered. Overwriting listener...`);
      this.unregister(accelerator);
    }

    try {
      const success = globalShortcut.register(accelerator, callback);
      if (success) {
        this.shortcuts.set(accelerator, callback);
        console.log(`[ShortcutService] Registered accelerator: "${accelerator}"`);
      } else {
        console.error(`[ShortcutService] Failed to register accelerator: "${accelerator}"`);
      }
      return success;
    } catch (error) {
      console.error(`[ShortcutService] Exception during registration of "${accelerator}":`, error);
      return false;
    }
  }

  /**
   * Unregisters a specific global shortcut.
   */
  unregister(accelerator: string): void {
    try {
      if (globalShortcut.isRegistered(accelerator)) {
        globalShortcut.unregister(accelerator);
        this.shortcuts.delete(accelerator);
        console.log(`[ShortcutService] Unregistered accelerator: "${accelerator}"`);
      }
    } catch (error) {
      console.error(`[ShortcutService] Exception during unregistration of "${accelerator}":`, error);
    }
  }

  /**
   * Unregisters all active shortcuts. Call this on app close.
   */
  unregisterAll(): void {
    try {
      globalShortcut.unregisterAll();
      this.shortcuts.clear();
      console.log('[ShortcutService] Unregistered all shortcuts successfully.');
    } catch (error) {
      console.error('[ShortcutService] Exception during global unregistration:', error);
    }
  }
}
