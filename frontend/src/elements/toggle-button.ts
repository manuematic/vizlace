import { html } from "lit";
import type { VizlaceElementDefinition } from "../types";
import { registry } from "./registry";
import {
  styleConfigField,
  getStyle,
  controlBackground,
  controlBorder,
  controlRadius,
} from "./styles";

const toggleButtonDef: VizlaceElementDefinition = {
  type: "toggle-button",
  label: "Toggle-Button",
  icon: "mdi:toggle-switch",
  defaultSize: { width: 140, height: 60 },
  defaultConfig: {
    on_label: "An",
    off_label: "Aus",
    on_color: "#4caf50",
    off_color: "#757575",
  },
  configFields: [
    { key: "on_label", label: "Text (An)", type: "text", default: "An" },
    { key: "off_label", label: "Text (Aus)", type: "text", default: "Aus" },
    {
      key: "on_color",
      label: "Farbe (An)",
      type: "color",
      default: "#4caf50",
    },
    {
      key: "off_color",
      label: "Farbe (Aus)",
      type: "color",
      default: "#757575",
    },
    styleConfigField,
  ],
  render(config, state, hass) {
    const cfg = config.config;
    const onLabel = String(cfg.on_label ?? "An");
    const offLabel = String(cfg.off_label ?? "Aus");
    const onColor = String(cfg.on_color ?? "#4caf50");
    const offColor = String(cfg.off_color ?? "#757575");
    const style = getStyle(cfg);

    const isOn = state ? state.state === "on" || state.state === "true" : false;
    const label = isOn ? onLabel : offLabel;
    const color = isOn ? onColor : offColor;

    const handleClick = (e: Event) => {
      e.stopPropagation();
      if (!config.entity_id) return;
      hass.callService("homeassistant", "toggle", {
        entity_id: config.entity_id,
      });
    };

    return html`
      <div
        style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"
      >
        <button
          @click=${handleClick}
          style="
            background:${controlBackground(style, color)};
            color:#fff;
            border:${controlBorder(style)};
            border-radius:${controlRadius(style)};
            padding:8px 20px;
            font-size:15px;
            font-weight:bold;
            cursor:pointer;
            width:90%;
            height:80%;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            transition:background 0.2s, filter 0.1s;
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

registry.register(toggleButtonDef);
