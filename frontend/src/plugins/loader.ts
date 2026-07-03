import type { HomeAssistant } from "../ha/types";
import { wsPluginsList } from "../ha/websocket";

// Module-level so a plugin is only ever imported once per page session,
// even if loadPlugins() is called again (e.g. panel reconnect).
const loadedIds = new Set<string>();

export async function loadPlugins(hass: HomeAssistant): Promise<void> {
  const { plugins } = await wsPluginsList(hass);

  for (const plugin of plugins) {
    if (loadedIds.has(plugin.id)) continue;
    loadedIds.add(plugin.id);

    const url = URL.createObjectURL(
      new Blob([plugin.code], { type: "application/javascript" })
    );
    try {
      await import(/* @vite-ignore */ url);
    } catch (err) {
      // One broken plugin must not break the rest of the dashboard.
      console.error(`Vizlace: failed to load plugin "${plugin.filename}"`, err);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}
