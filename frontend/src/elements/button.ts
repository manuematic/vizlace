import { html } from "lit";
import type { VizlaceElementDefinition } from "../types";
import { registry } from "./registry";

const buttonDef: VizlaceElementDefinition = {
  type: "button",
  label: "Button",
  icon: "mdi:gesture-tap-button",
  defaultSize: { width: 140, height: 60 },
  defaultConfig: {
    label: "Press",
    service_domain: "homeassistant",
    service_name: "toggle",
    service_data: "{}",
    color: "#2196f3",
  },
  configFields: [
    { key: "label", label: "Button Label", type: "text", default: "Press" },
    {
      key: "service_domain",
      label: "Service Domain",
      type: "text",
      default: "homeassistant",
    },
    {
      key: "service_name",
      label: "Service Name",
      type: "text",
      default: "toggle",
    },
    {
      key: "service_data",
      label: "Service Data (JSON)",
      type: "text",
      default: "{}",
    },
    { key: "color", label: "Color", type: "color", default: "#2196f3" },
  ],
  render(config, _state, hass) {
    const cfg = config.config;
    const label = String(cfg.label ?? "Press");
    const domain = String(cfg.service_domain ?? "homeassistant");
    const service = String(cfg.service_name ?? "toggle");
    const color = String(cfg.color ?? "#2196f3");

    let serviceData: Record<string, unknown> = {};
    try {
      serviceData = JSON.parse(String(cfg.service_data ?? "{}"));
    } catch {
      // ignore bad JSON
    }

    if (config.entity_id && !serviceData.entity_id) {
      serviceData = { entity_id: config.entity_id, ...serviceData };
    }

    const handleClick = (e: Event) => {
      e.stopPropagation();
      hass.callService(domain, service, serviceData);
    };

    return html`
      <div
        style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"
      >
        <button
          @click=${handleClick}
          style="
            background:${color};
            color:#fff;
            border:none;
            border-radius:6px;
            padding:8px 20px;
            font-size:15px;
            font-weight:bold;
            cursor:pointer;
            width:90%;
            height:80%;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            transition:filter 0.1s;
          "
          @mousedown=${(e: Event) =>
            ((e.currentTarget as HTMLElement).style.filter = "brightness(0.85)")}
          @mouseup=${(e: Event) =>
            ((e.currentTarget as HTMLElement).style.filter = "")}
          @mouseleave=${(e: Event) =>
            ((e.currentTarget as HTMLElement).style.filter = "")}
        >
          ${label}
        </button>
      </div>
    `;
  },
};

registry.register(buttonDef);
