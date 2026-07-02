import { html } from "lit";
import type { VizlaceElementDefinition } from "../types";
import { registry } from "./registry";

const textDisplayDef: VizlaceElementDefinition = {
  type: "text-display",
  label: "Text Display",
  icon: "mdi:text",
  defaultSize: { width: 160, height: 80 },
  defaultConfig: {
    label: "",
    fontSize: 28,
    color: "#ffffff",
    unit: "",
    prefix: "",
  },
  configFields: [
    { key: "label", label: "Label", type: "text", default: "" },
    { key: "prefix", label: "Prefix", type: "text", default: "" },
    { key: "unit", label: "Unit", type: "text", default: "" },
    { key: "fontSize", label: "Font size (px)", type: "number", default: 28 },
    { key: "color", label: "Color", type: "color", default: "#ffffff" },
  ],
  render(config, state, _hass) {
    const cfg = config.config;
    const label = String(cfg.label ?? "");
    const fontSize = Number(cfg.fontSize ?? 28);
    const color = String(cfg.color ?? "#ffffff");
    const unit = String(cfg.unit ?? "");
    const prefix = String(cfg.prefix ?? "");

    const displayValue = state
      ? `${prefix}${state.state}${unit}`
      : "—";

    return html`
      <div
        style="
          width:100%;height:100%;
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          box-sizing:border-box;padding:4px;
        "
      >
        <div
          style="
            font-size:${fontSize}px;
            font-weight:bold;
            color:${color};
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          "
        >
          ${displayValue}
        </div>
        ${label
          ? html`<div
              style="font-size:11px;color:var(--secondary-text-color,#aaa);margin-top:2px;"
            >
              ${label}
            </div>`
          : ""}
      </div>
    `;
  },
};

registry.register(textDisplayDef);
