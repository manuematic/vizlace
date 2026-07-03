import { html, svg } from "lit";
import type { VizlaceElementDefinition } from "../types";
import { registry } from "./registry";
import { arcPath, polarToCartesian } from "./arc";
import {
  styleConfigField,
  getStyle,
  panelChromeCss,
  fgColor,
  fgColorMuted,
} from "./styles";

const GREEN = "#4caf50";
const YELLOW = "#ffca28";
const RED = "#f44336";

const START = -135;
const RANGE = 270;
const CX = 80;
const CY = 80;
const R = 60;

const tricolorGaugeDef: VizlaceElementDefinition = {
  type: "tricolor-gauge",
  label: "Ampel-Gauge",
  icon: "mdi:gauge-full",
  defaultSize: { width: 160, height: 160 },
  defaultConfig: {
    min: 0,
    max: 100,
    unit: "",
    label: "",
    green_pct: 40,
    yellow_pct: 30,
    red_pct: 30,
    invert: false,
  },
  configFields: [
    { key: "label", label: "Label", type: "text", default: "" },
    { key: "min", label: "Min", type: "number", default: 0 },
    { key: "max", label: "Max", type: "number", default: 100 },
    { key: "unit", label: "Unit", type: "text", default: "" },
    {
      key: "green_pct",
      label: "Grün (%)",
      type: "number",
      default: 40,
      min: 0,
      max: 100,
    },
    {
      key: "yellow_pct",
      label: "Gelb (%)",
      type: "number",
      default: 30,
      min: 0,
      max: 100,
    },
    {
      key: "red_pct",
      label: "Rot (%)",
      type: "number",
      default: 30,
      min: 0,
      max: 100,
    },
    {
      key: "invert",
      label: "Reihenfolge umkehren (Rot am Anfang)",
      type: "boolean",
      default: false,
    },
    styleConfigField,
  ],
  render(config, state, _hass) {
    const cfg = config.config;
    const min = Number(cfg.min ?? 0);
    const max = Number(cfg.max ?? 100);
    const unit = String(cfg.unit ?? "");
    const label = String(cfg.label ?? "");
    const invert = Boolean(cfg.invert);
    const style = getStyle(cfg);
    const fg = fgColor(style);
    const fgMuted = fgColorMuted(style);

    const green = Math.max(0, Number(cfg.green_pct ?? 40));
    const yellow = Math.max(0, Number(cfg.yellow_pct ?? 30));
    const red = Math.max(0, Number(cfg.red_pct ?? 30));
    const total = green + yellow + red || 1;

    const segments = invert
      ? [
          { color: RED, frac: red / total },
          { color: YELLOW, frac: yellow / total },
          { color: GREEN, frac: green / total },
        ]
      : [
          { color: GREEN, frac: green / total },
          { color: YELLOW, frac: yellow / total },
          { color: RED, frac: red / total },
        ];

    let cursor = START;
    const arcs = segments.map((seg) => {
      const segStart = cursor;
      const segEnd = cursor + seg.frac * RANGE;
      cursor = segEnd;
      return { color: seg.color, start: segStart, end: segEnd };
    });

    const raw = state ? parseFloat(state.state) : NaN;
    const value = isNaN(raw) ? min : raw;
    const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
    const needleDeg = START + pct * RANGE;
    const [needleX, needleY] = polarToCartesian(CX, CY, R - 6, needleDeg);
    const [hubOuterX, hubOuterY] = polarToCartesian(CX, CY, 10, needleDeg);
    const needleColor = style === "default" ? "#fff" : "#1a1a1a";

    return html`
      <div
        style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;${panelChromeCss(
          style,
          "tricolor-gauge"
        )}"
      >
        ${svg`
          <svg viewBox="0 0 160 160" width="100%" height="100%" style="overflow:visible">
            ${arcs.map(
              (a) =>
                svg`<path d="${arcPath(CX, CY, R, a.start, a.end)}" fill="none" stroke="${a.color}" stroke-width="12" stroke-linecap="butt"/>`
            )}
            <line x1="${hubOuterX}" y1="${hubOuterY}" x2="${needleX}" y2="${needleY}"
              stroke="${needleColor}" stroke-width="3" stroke-linecap="round"/>
            <circle cx="${CX}" cy="${CY}" r="6" fill="${needleColor}"/>
            <text x="80" y="130" text-anchor="middle" dominant-baseline="middle"
              font-size="18" font-weight="bold" fill="${fg}">
              ${state ? state.state : "—"}${unit}
            </text>
            ${label ? svg`<text x="80" y="148" text-anchor="middle" font-size="11" fill="${fgMuted}">${label}</text>` : ""}
          </svg>
        `}
      </div>
    `;
  },
};

registry.register(tricolorGaugeDef);
