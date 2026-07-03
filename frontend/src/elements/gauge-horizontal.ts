import { html } from "lit";
import type { VizlaceElementDefinition } from "../types";
import { registry } from "./registry";
import {
  styleConfigField,
  getStyle,
  panelChromeCss,
  fgColor,
  fgColorMuted,
  trackColor,
  controlRadius,
} from "./styles";

const gaugeHorizontalDef: VizlaceElementDefinition = {
  type: "gauge-horizontal",
  label: "Gauge (waagerecht)",
  icon: "mdi:gauge-low",
  defaultSize: { width: 220, height: 90 },
  defaultConfig: {
    min: 0,
    max: 100,
    unit: "",
    label: "",
    color: "#4caf50",
  },
  configFields: [
    { key: "label", label: "Label", type: "text", default: "" },
    { key: "min", label: "Min", type: "number", default: 0 },
    { key: "max", label: "Max", type: "number", default: 100 },
    { key: "unit", label: "Unit", type: "text", default: "" },
    { key: "color", label: "Color", type: "color", default: "#4caf50" },
    styleConfigField,
  ],
  render(config, state, _hass) {
    const cfg = config.config;
    const min = Number(cfg.min ?? 0);
    const max = Number(cfg.max ?? 100);
    const unit = String(cfg.unit ?? "");
    const label = String(cfg.label ?? "");
    const color = String(cfg.color ?? "#4caf50");
    const style = getStyle(cfg);
    const fg = fgColor(style);
    const fgMuted = fgColorMuted(style);
    const track = trackColor(style);
    const radius = controlRadius(style);

    const raw = state ? parseFloat(state.state) : NaN;
    const value = isNaN(raw) ? 0 : raw;
    const pct = Math.min(1, Math.max(0, (value - min) / (max - min))) * 100;

    return html`
      <div
        style="
          width:100%;height:100%;box-sizing:border-box;padding:10px 14px;
          display:flex;flex-direction:column;justify-content:center;gap:6px;
          ${panelChromeCss(style, "gauge-horizontal")}
        "
      >
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          ${label
            ? html`<span style="font-size:11px;color:${fgMuted};">${label}</span>`
            : html`<span></span>`}
          <span style="font-size:16px;font-weight:bold;color:${fg};">
            ${state ? state.state : "—"}${unit}
          </span>
        </div>
        <div
          style="
            position:relative;height:14px;border-radius:${radius};
            background:${track};overflow:hidden;
          "
        >
          <div
            style="
              position:absolute;left:0;top:0;bottom:0;width:${pct}%;
              background:${color};border-radius:${radius};
              transition:width 0.3s;
            "
          ></div>
        </div>
      </div>
    `;
  },
};

registry.register(gaugeHorizontalDef);
