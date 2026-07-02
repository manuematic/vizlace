# Vizlace Dashboard

A free-placement visual dashboard for Home Assistant — similar to ioBroker's VIZ Editor. Place elements anywhere on a canvas and link them to HA entities.

## Features

- **Free-placement canvas** — drag elements to any position, resize with handles
- **Live data** — elements update in real time from HA entity states
- **Built-in elements**: Gauge, Text Display, Button, Color Field, Heating thermostat
- **Community API** — register custom elements via `window.vizlace.registerElement()`
- **Multiple dashboards** — create and switch between independent dashboards

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
   - Set the **Entity ID** to link the element to a HA entity.
   - Configure element-specific options (color, label, range, etc.).
   - Click **Save** when done.
4. Click the dashboard card to **view** it with live data.

## Built-in elements

| Element | Description |
|---|---|
| **Gauge** | SVG arc gauge for numeric sensor values. Config: min, max, unit, color. |
| **Text Display** | Shows entity state as large text. Config: font size, color, prefix, unit. |
| **Button** | Calls a HA service on click. Config: label, service domain/name/data, color. |
| **Color Field** | Colored rectangle driven by entity state. Mode `bw`: on/off → configurable colors. Mode `color`: entity state is used directly as CSS color. |
| **Heating** | Thermostat control for `climate` entities. Shows current and set-point temperature, +/− buttons call `climate.set_temperature`. |

## Community element API

Custom elements can be registered from an external JS module. In your HA `configuration.yaml` or a Lovelace resource, load your module **after** Vizlace, then:

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
  storage.py                   HA storage helper (per-dashboard JSON files)
  websocket_api.py             WS commands: list/get/save/delete dashboard

frontend/src/                ← TypeScript frontend
  main.ts                      entry: imports panel + all built-in elements
  vizlace-panel.ts             top-level custom element, routing (list/view/edit)
  types.ts                     shared TypeScript interfaces
  ha/types.ts                  HA-specific interfaces (HomeAssistant, HassEntity)
  ha/websocket.ts              typed wrappers for WS commands
  elements/registry.ts         VizlaceElementDefinition registry + window.vizlace API
  elements/gauge.ts            SVG arc gauge
  elements/text-display.ts     text state display
  elements/button.ts           service-call button
  elements/color-field.ts      color rectangle
  elements/heating.ts          climate thermostat control
  editor/canvas.ts             drag-and-drop editor canvas (pointer events)
  editor/toolbar.ts            element type picker sidebar
  editor/inspector.ts          selected-element property panel
  editor/index.ts              editor orchestrator
  viewer/canvas.ts             read-only live-data canvas
```

## WebSocket API reference

All commands are prefixed `vizlace/`.

| Command | Params | Returns |
|---|---|---|
| `vizlace/dashboards/list` | — | `{ dashboards: Dashboard[] }` |
| `vizlace/dashboard/get` | `{ id }` | `{ dashboard: Dashboard }` |
| `vizlace/dashboard/save` | `{ dashboard: Dashboard }` | `{ dashboard: Dashboard }` |
| `vizlace/dashboard/delete` | `{ id }` | `{}` |
| `vizlace/call_service` | `{ domain, service, service_data? }` | `{}` |

## License

MIT
