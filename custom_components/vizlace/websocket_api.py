"""WebSocket API handlers for Vizlace."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .storage import VizlaceStorage


def async_register_commands(hass: HomeAssistant, storage: VizlaceStorage) -> None:
    """Register all Vizlace WebSocket commands."""
    hass.components.websocket_api.async_register_command(
        hass, handle_dashboards_list
    )
    hass.components.websocket_api.async_register_command(
        hass, handle_dashboard_get
    )
    hass.components.websocket_api.async_register_command(
        hass, handle_dashboard_save
    )
    hass.components.websocket_api.async_register_command(
        hass, handle_dashboard_delete
    )
    hass.components.websocket_api.async_register_command(
        hass, handle_call_service
    )
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
        vol.Required("id"): str,
    }
)
@websocket_api.async_response
async def handle_dashboard_get(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    storage: VizlaceStorage = hass.data[DOMAIN]["storage"]
    dashboard = await storage.async_get_dashboard(msg["id"])
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
        vol.Required("id"): str,
    }
)
@websocket_api.async_response
async def handle_dashboard_delete(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    storage: VizlaceStorage = hass.data[DOMAIN]["storage"]
    deleted = await storage.async_delete_dashboard(msg["id"])
    if not deleted:
        connection.send_error(msg["id"], "not_found", "Dashboard not found")
        return
    connection.send_result(msg["id"], {"id": msg["id"]})


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
