# Vizlace Dashboard

A free-placement visual dashboard for Home Assistant — similar to ioBroker's VIZ Editor. Place elements anywhere on a canvas and link them to HA entities.

## Features

- **Free-placement canvas** — drag elements to any position, resize with handles
- **Live data** — elements update in real time from HA entity states
- **Built-in elements**: Gauge, Horizontal Gauge, Tricolor Gauge, Text Display, Button, Toggle Button, Color Field, Heating thermostat, Frame
- **Element styles** — every element can be switched between Standard, Metallic, and Mondrian looks
- **Searchable entity picker** — live filter by entity id or friendly name when linking an element
- **Configurable grid** — adjust the snap grid spacing, or turn snapping off entirely
- **Screen resolution guide** — enter a target screen size to see its bounds as an overlay on the canvas
- **Plugin Manager** — admins can upload/remove community element plugins (`.js` files) directly from the UI, no HA config editing needed
- **Community API** — register custom elements via `window.vizlace.registerElement()`
- **Multiple dashboards** — create and switch between independent dashboards

## Requirements

Home Assistant 2024.7.0 or newer (uses `hass.http.async_register_static_paths`, which replaced the older `register_static_path` API).

## Installation

### Manual

1. Copy the `custom_components/vizlace` directory into your HA config directory:
   ```
   <config>/custom_components/vizlace/
   ```
2. Add to `configuration.yaml`:
   ```yaml
   vizlace:
   ```
3. Restart Home Assistant.
4. "Vizlace" appears in the sidebar.

### HACS

Add this repository as a custom repository in HACS (type: Integration), then install "Vizlace Dashboard".

## Building the frontend

The pre-built `custom_components/vizlace/www/vizlace.js` is included. To rebuild after modifying the frontend:

```bash
cd frontend
npm install
npm run build
```

The build output goes directly to `custom_components/vizlace/www/vizlace.js`.

## Usage

1. Click **Vizlace** in the sidebar.
2. Click **+ New Dashboard** to create a dashboard.
3. In the editor:
   - Use the **left toolbar** to add elements to the canvas.
   - **Drag** elements to reposition them; use the **resize handles** to resize.
   - Click an element to select it — the **right inspector** shows its properties.
   - Set the **Entity ID** to link the element to a HA entity — start typing to search by entity id or friendly name and pick a match, or type a full id directly.
   - Configure element-specific options (color, label, range, etc.).
   - Click **Save** when done.
   - With nothing selected, the right panel shows **Canvas Settings**: grid spacing, a snap-to-grid toggle, and an optional screen width/height that draws a dashed guide on the canvas so you can see how much space a real screen gives you.
4. Click the dashboard card to **view** it with live data.

## Built-in elements

| Element | Description |
|---|---|
| **Gauge** | SVG arc gauge for numeric sensor values. Config: min, max, unit, color. |
| **Horizontal Gauge** | Same as Gauge but rendered as a horizontal fill bar. |
| **Tricolor Gauge** | Arc gauge with fixed green/yellow/red zones, sized by percentage, plus a needle. Config: min, max, unit, green/yellow/red %, invert order. |
| **Text Display** | Shows entity state as large text. Config: font size, color, prefix, unit. |
| **Button** | Calls a HA service on click. Config: label, service domain/name/data, color. |
| **Toggle Button** | Calls `homeassistant.toggle` on the linked entity; label and color switch between an on/off pair based on entity state. |
| **Color Field** | Colored rectangle driven by entity state. Mode `bw`: on/off → configurable colors. Mode `color`: entity state is used directly as CSS color. |
| **Heating** | Thermostat control for `climate` entities. Shows current and set-point temperature, +/− buttons call `climate.set_temperature`. |
| **Frame** | Border-only rectangle for visually grouping other elements. Config: border width (0–20px), border color. Transparent and click-through in view mode. |

Every element (built-in or community) also gets a **Style** field — Standard, Metallic, or Mondrian — in its inspector. New looks are added centrally in `frontend/src/elements/styles.ts`.

## Plugin Manager (community elements, self-service)

Admins can install and remove community element plugins directly from the Vizlace UI — no editing `configuration.yaml` or Lovelace resources required:

1. Click **Plugins** in the dashboard list header (only visible to admin users).
2. **Upload** a `.js` file — it's stored in HA's storage and loaded into every Vizlace session from then on.
3. **Remove** a plugin to stop loading it; already-registered element types simply disappear from the toolbox (existing placed instances on dashboards render as "Unknown" until you delete them or reinstall the plugin).

> **⚠️ Security note:** a plugin is a JavaScript file that runs with full access to your Home Assistant entities and services in the panel's browser context — the same trust level as a custom Lovelace card from HACS. Only install plugins from sources you trust. Upload/removal is restricted to HA admin users; any signed-in user can view dashboards that use already-installed plugins.

## Community element API

Custom elements register themselves by calling `window.vizlace.registerElement(...)` when their module loads. Write a plain `.js` file that does this, then either:

- **Install it via the Plugin Manager** (see above) — the recommended path, works for any user on the dashboard without further setup, and can be removed the same way, or
- Load it yourself as an external JS module: in your HA `configuration.yaml` or a Lovelace resource, load your module **after** Vizlace, then:

```javascript
window.vizlace.registerElement({
  type: "my-element",          // unique type string
  label: "My Element",         // shown in toolbar
  icon: "mdi:star",
  defaultSize: { width: 120, height: 80 },
  defaultConfig: { color: "#ff0" },
  configFields: [
    { key: "color", label: "Color", type: "color", default: "#ff0" }
  ],
  render(config, state, hass) {
    // return a Lit html`` template result
    const { html } = window.lit;   // Lit is bundled and re-exported via window.lit
    return html`
      <div style="background:${config.config.color};width:100%;height:100%;">
        ${state?.state ?? "—"}
      </div>
    `;
  }
});
```

### ConfigField types

| type | Rendered as |
|---|---|
| `text` | `<input type="text">` |
| `number` | `<input type="number">` |
| `color` | `<input type="color">` |
| `boolean` | `<input type="checkbox">` |
| `select` | `<select>` — requires `options: [{value, label}]` |

## Architecture

```
custom_components/vizlace/   ← Python integration (HA side)
  __init__.py                  setup, panel + WS registration
  panel.py                     static file path + panel registration
  storage.py                   HA storage helper (per-dashboard JSON files + plugins)
  websocket_api.py             WS commands: dashboards, plugins, call_service

frontend/src/                ← TypeScript frontend
  main.ts                      entry: imports panel + all built-in elements, sets up window.lit
  vizlace-panel.ts             top-level custom element, routing (list/view/edit/plugins)
  types.ts                     shared TypeScript interfaces
  ha/types.ts                  HA-specific interfaces (HomeAssistant, HassEntity)
  ha/websocket.ts              typed wrappers for WS commands
  elements/registry.ts         VizlaceElementDefinition registry + window.vizlace API
  elements/styles.ts           shared Standard/Metallic/Mondrian style helpers
  elements/arc.ts              shared SVG arc-gauge geometry helpers
  elements/gauge.ts            SVG arc gauge
  elements/gauge-horizontal.ts horizontal fill-bar gauge
  elements/tricolor-gauge.ts   green/yellow/red zone gauge with needle
  elements/text-display.ts     text state display
  elements/button.ts           service-call button
  elements/toggle-button.ts    on/off toggle button (label + color follow state)
  elements/color-field.ts      color rectangle
  elements/heating.ts          climate thermostat control
  elements/frame.ts            border-only grouping rectangle
  plugins/loader.ts            fetches installed plugins, dynamic-imports them as blob URLs
  plugins/manager.ts           admin UI: upload/list/delete plugins
  editor/canvas.ts             drag-and-drop editor canvas (pointer events)
  editor/toolbar.ts            element type picker sidebar
  editor/inspector.ts          selected-element property panel
  editor/entity-picker.ts      searchable entity id combobox
  editor/index.ts              editor orchestrator
  viewer/canvas.ts             read-only live-data canvas
```

## WebSocket API reference

All commands are prefixed `vizlace/`.

| Command | Params | Returns |
|---|---|---|
| `vizlace/dashboards/list` | — | `{ dashboards: Dashboard[] }` |
| `vizlace/dashboard/get` | `{ dashboard_id }` | `{ dashboard: Dashboard }` |
| `vizlace/dashboard/save` | `{ dashboard: Dashboard }` | `{ dashboard: Dashboard }` |
| `vizlace/dashboard/delete` | `{ dashboard_id }` | `{ id }` |
| `vizlace/call_service` | `{ domain, service, service_data? }` | `{}` |
| `vizlace/plugins/list` | — | `{ plugins: PluginRecord[] }` (code included; open to any user) |
| `vizlace/plugins/upload` | `{ filename, code }` | `{ plugin: PluginRecord }` (admin only, max 2 MB) |
| `vizlace/plugins/delete` | `{ plugin_id }` | `{ id }` (admin only) |

> Note: id params are named `dashboard_id` / `plugin_id`, never `id` — the top-level `id` field on every HA WebSocket message is reserved for the framework's own request/response correlation number and gets overwritten if reused.

## License

MIT
