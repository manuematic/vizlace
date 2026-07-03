import type { HomeAssistant } from "./types";
import type { Dashboard, PluginRecord } from "../types";

export async function wsDashboardsList(
  hass: HomeAssistant
): Promise<{ dashboards: Dashboard[] }> {
  return hass.callWS({ type: "vizlace/dashboards/list" }) as Promise<{
    dashboards: Dashboard[];
  }>;
}

export async function wsDashboardGet(
  hass: HomeAssistant,
  id: string
): Promise<{ dashboard: Dashboard }> {
  return hass.callWS({
    type: "vizlace/dashboard/get",
    dashboard_id: id,
  }) as Promise<{
    dashboard: Dashboard;
  }>;
}

export async function wsDashboardSave(
  hass: HomeAssistant,
  dashboard: Dashboard
): Promise<{ dashboard: Dashboard }> {
  return hass.callWS({
    type: "vizlace/dashboard/save",
    dashboard,
  }) as Promise<{ dashboard: Dashboard }>;
}

export async function wsDashboardDelete(
  hass: HomeAssistant,
  id: string
): Promise<void> {
  await hass.callWS({ type: "vizlace/dashboard/delete", dashboard_id: id });
}

export async function wsPluginsList(
  hass: HomeAssistant
): Promise<{ plugins: PluginRecord[] }> {
  return hass.callWS({ type: "vizlace/plugins/list" }) as Promise<{
    plugins: PluginRecord[];
  }>;
}

export async function wsPluginUpload(
  hass: HomeAssistant,
  filename: string,
  code: string
): Promise<{ plugin: PluginRecord }> {
  return hass.callWS({
    type: "vizlace/plugins/upload",
    filename,
    code,
  }) as Promise<{ plugin: PluginRecord }>;
}

export async function wsPluginDelete(
  hass: HomeAssistant,
  id: string
): Promise<void> {
  await hass.callWS({ type: "vizlace/plugins/delete", plugin_id: id });
}
