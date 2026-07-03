"""Storage helper for Vizlace dashboards and plugins."""
from __future__ import annotations

import uuid
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN, STORAGE_VERSION

_INDEX_KEY = f"{DOMAIN}.index"
_PLUGINS_KEY = f"{DOMAIN}.plugins"


class VizlaceStorage:
    """Manages persistence of Vizlace dashboards using HA storage."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._index_store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, _INDEX_KEY
        )
        # index: {id -> {id, title, background}}
        self._index: dict[str, dict[str, Any]] = {}
        # per-dashboard stores cached by id
        self._stores: dict[str, Store[dict[str, Any]]] = {}

        self._plugins_store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, _PLUGINS_KEY
        )
        # plugins: {id -> {id, filename, code, installed_at}}
        self._plugins: dict[str, dict[str, Any]] = {}

    async def async_load(self) -> None:
        data = await self._index_store.async_load()
        if data:
            self._index = data
        plugin_data = await self._plugins_store.async_load()
        if plugin_data:
            self._plugins = plugin_data

    def _dashboard_store(self, dashboard_id: str) -> Store[dict[str, Any]]:
        if dashboard_id not in self._stores:
            self._stores[dashboard_id] = Store(
                self._hass,
                STORAGE_VERSION,
                f"{DOMAIN}.{dashboard_id}",
            )
        return self._stores[dashboard_id]

    async def async_get_dashboards(self) -> list[dict[str, Any]]:
        """Return summary list of all dashboards (id, title, background)."""
        return list(self._index.values())

    async def async_get_dashboard(self, dashboard_id: str) -> dict[str, Any] | None:
        """Return full dashboard config including elements."""
        if dashboard_id not in self._index:
            return None
        store = self._dashboard_store(dashboard_id)
        data = await store.async_load()
        if data is None:
            # Return minimal stub if detail store missing
            return {**self._index[dashboard_id], "elements": []}
        return data

    async def async_save_dashboard(self, dashboard: dict[str, Any]) -> dict[str, Any]:
        """Create or update a dashboard. Assigns id if missing."""
        if not dashboard.get("id"):
            dashboard["id"] = uuid.uuid4().hex

        dashboard_id = dashboard["id"]
        # Update index with summary fields
        self._index[dashboard_id] = {
            "id": dashboard_id,
            "title": dashboard.get("title", "Unnamed"),
            "background": dashboard.get("background", ""),
        }
        await self._index_store.async_save(self._index)

        # Save full data
        store = self._dashboard_store(dashboard_id)
        await store.async_save(dashboard)
        return dashboard

    async def async_delete_dashboard(self, dashboard_id: str) -> bool:
        """Delete a dashboard. Returns True if it existed."""
        if dashboard_id not in self._index:
            return False
        del self._index[dashboard_id]
        await self._index_store.async_save(self._index)
        store = self._dashboard_store(dashboard_id)
        await store.async_remove()
        self._stores.pop(dashboard_id, None)
        return True

    async def async_get_plugins(self) -> list[dict[str, Any]]:
        """Return all installed community plugins, including their code."""
        return list(self._plugins.values())

    async def async_save_plugin(self, filename: str, code: str) -> dict[str, Any]:
        """Store a new community plugin. Always assigns a fresh id."""
        plugin_id = uuid.uuid4().hex
        plugin = {
            "id": plugin_id,
            "filename": filename,
            "code": code,
            "installed_at": dt_util.utcnow().isoformat(),
        }
        self._plugins[plugin_id] = plugin
        await self._plugins_store.async_save(self._plugins)
        return plugin

    async def async_delete_plugin(self, plugin_id: str) -> bool:
        """Delete a plugin. Returns True if it existed."""
        if plugin_id not in self._plugins:
            return False
        del self._plugins[plugin_id]
        await self._plugins_store.async_save(self._plugins)
        return True
