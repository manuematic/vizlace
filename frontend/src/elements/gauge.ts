import { html, svg } from "lit";
import type { VizlaceElementDefinition } from "../types";
import { registry } from "./registry";

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
): string {
  const [sx, sy] = polarToCartesian(cx, cy, r, startDeg);
  const [ex, ey] = polarToCartesian(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

const gaugeDef: VizlaceElementDefinition = {
  type: "gauge",
  label: "Gauge",
  icon: "mdi:gauge",
  defaultSize: { width: 160, height: 160 },
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
  ],
  render(config, state, _hass) {
    const cfg = config.config;
    const min = Number(cfg.min ?? 0);
    const max = Number(cfg.max ?? 100);
    const unit = String(cfg.unit ?? "");
    const label = String(cfg.label ?? "");
    const color = String(cfg.color ?? "#4caf50");

    const raw = state ? parseFloat(state.state) : NaN;
    const value = isNaN(raw) ? 0 : raw;
    const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));

    const START = -135;
    const RANGE = 270;
    const endDeg = START + pct * RANGE;

    const cx = 80;
    const cy = 80;
    const r = 60;

    const trackPath = arcPath(cx, cy, r, START, START + RANGE);
    const fillPath = pct > 0 ? arcPath(cx, cy, r, START, endDeg) : "";

    return html`
      <div
        style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;"
      >
        ${svg`
          <svg viewBox="0 0 160 160" width="100%" height="100%" style="overflow:visible">
            <path d="${trackPath}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="12" stroke-linecap="round"/>
            ${fillPath ? svg`<path d="${fillPath}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/>` : ""}
            <text x="80" y="82" text-anchor="middle" dominant-baseline="middle"
              font-size="22" font-weight="bold" fill="var(--primary-text-color,#fff)">
              ${state ? state.state : "—"}${unit}
            </text>
            ${label ? svg`<text x="80" y="106" text-anchor="middle" font-size="11" fill="var(--secondary-text-color,#aaa)">${label}</text>` : ""}
          </svg>
        `}
      </div>
    `;
  },
};

registry.register(gaugeDef);
