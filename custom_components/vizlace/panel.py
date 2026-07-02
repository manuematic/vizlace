"""Register Vizlace panel and static files."""
from __future__ import annotations

import os

from homeassistant.components.frontend import async_register_built_in_panel
from homeassistant.core import HomeAssistant


async def async_register_panel(hass: HomeAssistant) -> None:
    """Register the Vizlace custom panel."""
    www_path = os.path.join(os.path.dirname(__file__), "www")

    hass.http.register_static_path(
        "/vizlace_static",
        www_path,
        cache_headers=False,
    )

    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title="Vizlace",
        sidebar_icon="mdi:view-dashboard-variant",
        frontend_url_path="vizlace",
        config={
            "_panel_custom": {
                "name": "vizlace-panel",
                "embed_iframe": False,
                "trust_external_script": True,
                "module_url": "/vizlace_static/vizlace.js",
            }
        },
        require_admin=False,
    )
