"""WebSocket API handlers for Vizlace."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .storage import VizlaceStorage

# Guards against pathological uploads; community plugins are small JS files.
MAX_PLUGIN_SIZE = 2_000_000


def async_register_commands(hass: HomeAssistant, storage: VizlaceStorage) -> None:
    """Register all Vizlace WebSocket commands."""
    websocket_api.async_register_command(hass, handle_dashboards_list)
    websocket_api.async_register_command(hass, handle_dashboard_get)
    websocket_api.async_register_command(hass, handle_dashboard_save)
    websocket_api.async_register_command(hass, handle_dashboard_delete)
    websocket_api.async_register_command(hass, handle_call_service)
    websocket_api.async_register_command(hass, handle_plugins_list)
    websocket_api.async_register_command(hass, handle_plugins_upload)
    websocket_api.async_register_command(hass, handle_plugins_delete)
    # Store storage instance in hass.data for handlers to access
    hass.data.setdefault(DOMAIN, {})["storage"] = storage


@websocket_api.websocket_command({vol.Required("type"): "vizlace/dashboards/list"})
@websocket_api.async_response
async def handle_dashboards_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    storage: VizlaceStorage = hass.data[DOMAIN]["storage"]
    dashboards = await storage.async_get_dashboards()
    connection.send_result(msg["id"], {"dashboards": dashboards})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "vizlace/dashboard/get",
        vol.Required("dashboard_id"): str,
    }
)
@websocket_api.async_response
async def handle_dashboard_get(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    storage: VizlaceStorage = hass.data[DOMAIN]["storage"]
    dashboard = await storage.async_get_dashboard(msg["dashboard_id"])
    if dashboard is None:
        connection.send_error(msg["id"], "not_found", "Dashboard not found")
        return
    connection.send_result(msg["id"], {"dashboard": dashboard})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "vizlace/dashboard/save",
        vol.Required("dashboard"): dict,
    }
)
@websocket_api.async_response
async def handle_dashboard_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    storage: VizlaceStorage = hass.data[DOMAIN]["storage"]
    saved = await storage.async_save_dashboard(msg["dashboard"])
    connection.send_result(msg["id"], {"dashboard": saved})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "vizlace/dashboard/delete",
        vol.Required("dashboard_id"): str,
    }
)
@websocket_api.async_response
async def handle_dashboard_delete(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    storage: VizlaceStorage = hass.data[DOMAIN]["storage"]
    deleted = await storage.async_delete_dashboard(msg["dashboard_id"])
    if not deleted:
        connection.send_error(msg["id"], "not_found", "Dashboard not found")
        return
    connection.send_result(msg["id"], {"id": msg["dashboard_id"]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "vizlace/call_service",
        vol.Required("domain"): str,
        vol.Required("service"): str,
        vol.Optional("service_data"): dict,
    }
)
@websocket_api.async_response
async def handle_call_service(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    await hass.services.async_call(
        msg["domain"],
        msg["service"],
        msg.get("service_data") or {},
        blocking=False,
        context=connection.context(msg),
    )
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({vol.Required("type"): "vizlace/plugins/list"})
@websocket_api.async_response
async def handle_plugins_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    # Not admin-gated: any user viewing a dashboard needs its plugins loaded.
    storage: VizlaceStorage = hass.data[DOMAIN]["storage"]
    plugins = await storage.async_get_plugins()
    connection.send_result(msg["id"], {"plugins": plugins})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "vizlace/plugins/upload",
        vol.Required("filename"): str,
        vol.Required("code"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def handle_plugins_upload(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    if len(msg["code"]) > MAX_PLUGIN_SIZE:
        connection.send_error(msg["id"], "too_large", "Plugin file is too large")
        return
    storage: VizlaceStorage = hass.data[DOMAIN]["storage"]
    plugin = await storage.async_save_plugin(msg["filename"], msg["code"])
    connection.send_result(msg["id"], {"plugin": plugin})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "vizlace/plugins/delete",
        vol.Required("plugin_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def handle_plugins_delete(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    storage: VizlaceStorage = hass.data[DOMAIN]["storage"]
    deleted = await storage.async_delete_plugin(msg["plugin_id"])
    if not deleted:
        connection.send_error(msg["id"], "not_found", "Plugin not found")
        return
    connection.send_result(msg["id"], {"id": msg["plugin_id"]})
