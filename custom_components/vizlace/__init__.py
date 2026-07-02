"""Vizlace — free-placement visual dashboard for Home Assistant."""
from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
from .panel import async_register_panel
from .storage import VizlaceStorage
from .websocket_api import async_register_commands


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Vizlace integration."""
    storage = VizlaceStorage(hass)
    await storage.async_load()

    hass.data.setdefault(DOMAIN, {})["storage"] = storage

    await async_register_panel(hass)
    async_register_commands(hass, storage)

    return True
