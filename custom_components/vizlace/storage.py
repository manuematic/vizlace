"""Storage helper for Vizlace dashboards."""
from __future__ import annotations

import uuid
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN, STORAGE_VERSION

_INDEX_KEY = f"{DOMAIN}.index"


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

    async def async_load(self) -> None:
        data = await self._index_store.async_load()
        if data:
            self._index = data

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
