import type { ConfigField } from "../types";

export type ElementStyle = "default" | "metallic" | "mondrian" | "wood";

// Shared "Style" dropdown appended to every built-in element's configFields.
// New looks only need a new branch in the helpers below plus a new option
// here - no change to individual elements.
export const styleConfigField: ConfigField = {
  key: "style",
  label: "Style",
  type: "select",
  options: [
    { value: "default", label: "Standard" },
    { value: "metallic", label: "Metallic" },
    { value: "mondrian", label: "Mondrian" },
    { value: "wood", label: "Wood" },
  ],
  default: "default",
};

const STYLES: ElementStyle[] = ["metallic", "mondrian", "wood"];

export function getStyle(config: Record<string, unknown>): ElementStyle {
  return STYLES.includes(config.style as ElementStyle)
    ? (config.style as ElementStyle)
    : "default";
}

const METALLIC_BG =
  "linear-gradient(135deg, #9aa5ad 0%, #e2e8ec 22%, #6b7580 48%, #f2f5f7 58%, #7c8791 82%, #b7c1c8 100%)";
const METALLIC_BORDER = "1px solid rgba(255,255,255,0.5)";
const METALLIC_SHADOW =
  "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.4)";

const MONDRIAN_BG = "#f2f2ea";
const MONDRIAN_BORDER = "5px solid #111";
const MONDRIAN_COLORS = ["#d81e05", "#f7d716", "#0a4ea3"];

const WOOD_BG =
  "repeating-linear-gradient(95deg, #8a5a2f 0px, #9c6b3a 3px, #7a4a22 6px, #8a5a2f 9px), linear-gradient(160deg, #ac7b45 0%, #7a4a22 100%)";
const WOOD_BORDER = "3px solid #5c3a1a";
const WOOD_SHADOW =
  "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.35)";

// Deterministic accent color per element type, so all gauges (for example)
// pick up the same Mondrian primary across a dashboard.
export function mondrianAccent(type: string): string {
  let h = 0;
  for (let i = 0; i < type.length; i++) h = (h * 31 + type.charCodeAt(i)) >>> 0;
  return MONDRIAN_COLORS[h % MONDRIAN_COLORS.length];
}

// CSS for the outermost container of a card-like element (gauge, text
// display, color field, heating, ...). Empty string leaves current look.
export function panelChromeCss(style: ElementStyle, type: string): string {
  if (style === "metallic") {
    return `background:${METALLIC_BG};border:${METALLIC_BORDER};box-shadow:${METALLIC_SHADOW};border-radius:10px;`;
  }
  if (style === "mondrian") {
    return `background:${MONDRIAN_BG};border:${MONDRIAN_BORDER};box-shadow:inset -14px -14px 0 0 ${mondrianAccent(
      type
    )};border-radius:0;`;
  }
  if (style === "wood") {
    return `background:${WOOD_BG};border:${WOOD_BORDER};box-shadow:${WOOD_SHADOW};border-radius:8px;`;
  }
  return "";
}

export function fgColor(style: ElementStyle): string {
  if (style === "default") return "var(--primary-text-color,#fff)";
  if (style === "wood") return "#f5e6c8";
  return "#1a1a1a";
}

export function fgColorMuted(style: ElementStyle): string {
  if (style === "default") return "var(--secondary-text-color,#aaa)";
  if (style === "wood") return "#d8c39d";
  return "#4a4a4a";
}

export function trackColor(style: ElementStyle): string {
  if (style === "default") return "rgba(255,255,255,0.15)";
  if (style === "wood") return "rgba(0,0,0,0.35)";
  return "rgba(0,0,0,0.18)";
}

// Background for a clickable control (button, toggle) that already has its
// own semantic color - keeps the color but gives it the style's material.
export function controlBackground(style: ElementStyle, color: string): string {
  if (style === "metallic") {
    return `linear-gradient(135deg, ${color} 0%, #fff 8%, ${color} 40%, #000 105%)`;
  }
  if (style === "wood") {
    return `linear-gradient(${color}66, ${color}66), ${WOOD_BG}`;
  }
  return color;
}

export function controlBorder(style: ElementStyle): string {
  if (style === "metallic") return "1px solid rgba(255,255,255,0.6)";
  if (style === "mondrian") return "4px solid #111";
  if (style === "wood") return WOOD_BORDER;
  return "none";
}

export function controlRadius(style: ElementStyle): string {
  return style === "mondrian" ? "0" : "6px";
}
