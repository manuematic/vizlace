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
} from "./styles";

function formatValue(value: number, step: number): string {
  const decimals = step.toString().includes(".")
    ? step.toString().split(".")[1].length
    : 0;
  return value.toFixed(decimals);
}

const valueSliderDef: VizlaceElementDefinition = {
  type: "value-slider",
  label: "Regler",
  icon: "mdi:tune-variant",
  defaultSize: { width: 70, height: 200 },
  defaultConfig: {
    label: "",
    min: 0,
    max: 100,
    step: 1,
    unit: "",
    orientation: "vertical",
    color: "#03a9f4",
    service_domain: "input_number",
    service_name: "set_value",
    value_param: "value",
  },
  configFields: [
    { key: "label", label: "Label", type: "text", default: "" },
    { key: "min", label: "Min", type: "number", default: 0 },
    { key: "max", label: "Max", type: "number", default: 100 },
    { key: "step", label: "Step", type: "number", default: 1 },
    { key: "unit", label: "Unit", type: "text", default: "" },
    {
      key: "orientation",
      label: "Orientation",
      type: "select",
      options: [
        { value: "vertical", label: "Vertical" },
        { value: "horizontal", label: "Horizontal" },
      ],
      default: "vertical",
    },
    { key: "color", label: "Color", type: "color", default: "#03a9f4" },
    {
      key: "service_domain",
      label: "Service Domain",
      type: "text",
      default: "input_number",
    },
    {
      key: "service_name",
      label: "Service Name",
      type: "text",
      default: "set_value",
    },
    {
      key: "value_param",
      label: "Value Parameter",
      type: "text",
      default: "value",
    },
    styleConfigField,
  ],
  render(config, state, hass) {
    const cfg = config.config;
    const label = String(cfg.label ?? "");
    const min = Number(cfg.min ?? 0);
    const max = Number(cfg.max ?? 100);
    const step = Number(cfg.step ?? 1) || 1;
    const unit = String(cfg.unit ?? "");
    const orientation = cfg.orientation === "horizontal" ? "horizontal" : "vertical";
    const isVertical = orientation === "vertical";
    const color = String(cfg.color ?? "#03a9f4");
    const domain = String(cfg.service_domain ?? "input_number");
    const service = String(cfg.service_name ?? "set_value");
    const valueParam = String(cfg.value_param ?? "value");
    const style = getStyle(cfg);
    const fg = fgColor(style);
    const fgMuted = fgColorMuted(style);
    const track = trackColor(style);

    const raw = state ? parseFloat(state.state) : NaN;
    const value = isNaN(raw) ? min : Math.min(max, Math.max(min, raw));
    const pct = max > min ? (value - min) / (max - min) : 0;

    const applyPct = (
      fillEl: HTMLElement,
      knobEl: HTMLElement,
      textEl: HTMLElement,
      p: number
    ) => {
      const clamped = Math.min(1, Math.max(0, p));
      const rawValue = min + clamped * (max - min);
      const stepped = Math.round(rawValue / step) * step;
      const finalValue = Math.min(max, Math.max(min, stepped));
      const finalPct = max > min ? (finalValue - min) / (max - min) : 0;
      if (isVertical) {
        fillEl.style.height = `${finalPct * 100}%`;
        knobEl.style.bottom = `${finalPct * 100}%`;
      } else {
        fillEl.style.width = `${finalPct * 100}%`;
        knobEl.style.left = `${finalPct * 100}%`;
      }
      textEl.textContent = `${formatValue(finalValue, step)}${unit}`;
      return finalValue;
    };

    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!config.entity_id) return;
      const trackEl = e.currentTarget as HTMLElement;
      const rootEl = trackEl.closest(".vs-root") as HTMLElement;
      const fillEl = trackEl.querySelector(".vs-fill") as HTMLElement;
      const knobEl = trackEl.querySelector(".vs-knob") as HTMLElement;
      const textEl = rootEl.querySelector(".vs-value") as HTMLElement;
      trackEl.setPointerCapture(e.pointerId);

      const pctFromEvent = (ev: PointerEvent): number => {
        const rect = trackEl.getBoundingClientRect();
        if (isVertical) {
          return 1 - (ev.clientY - rect.top) / rect.height;
        }
        return (ev.clientX - rect.left) / rect.width;
      };

      let finalValue = applyPct(fillEl, knobEl, textEl, pctFromEvent(e));

      const onMove = (ev: PointerEvent) => {
        finalValue = applyPct(fillEl, knobEl, textEl, pctFromEvent(ev));
      };
      const onUp = () => {
        trackEl.removeEventListener("pointermove", onMove);
        trackEl.removeEventListener("pointerup", onUp);
        trackEl.removeEventListener("pointercancel", onUp);
        hass.callService(domain, service, {
          entity_id: config.entity_id,
          [valueParam]: finalValue,
        });
      };
      trackEl.addEventListener("pointermove", onMove);
      trackEl.addEventListener("pointerup", onUp, { once: true });
      trackEl.addEventListener("pointercancel", onUp, { once: true });
    };

    const fillStyle = isVertical
      ? `position:absolute;left:0;right:0;bottom:0;height:${pct * 100}%;background:${color};border-radius:999px;`
      : `position:absolute;top:0;bottom:0;left:0;width:${pct * 100}%;background:${color};border-radius:999px;`;

    const knobStyle = isVertical
      ? `position:absolute;left:50%;bottom:${pct * 100}%;transform:translate(-50%,50%);width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid ${color};box-shadow:0 1px 3px rgba(0,0,0,0.5);`
      : `position:absolute;top:50%;left:${pct * 100}%;transform:translate(-50%,-50%);width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid ${color};box-shadow:0 1px 3px rgba(0,0,0,0.5);`;

    return html`
      <div
        class="vs-root"
        style="
          width:100%;height:100%;
          display:flex;flex-direction:column;align-items:center;justify-content:space-between;
          box-sizing:border-box;padding:8px;
          color:${fg};
          ${panelChromeCss(style, "value-slider")}
        "
      >
        ${label
          ? html`<div style="font-size:11px;color:${fgMuted};">${label}</div>`
          : ""}
        <div
          style="
            flex:1;width:100%;min-height:0;min-width:0;
            display:flex;align-items:center;justify-content:center;
          "
        >
          <div
            class="vs-track"
            @pointerdown=${handlePointerDown}
            style="
              position:relative;
              ${isVertical ? "width:14px;height:100%;" : "width:100%;height:14px;"}
              border-radius:999px;
              background:${track};
              cursor:pointer;
              touch-action:none;
            "
          >
            <div class="vs-fill" style=${fillStyle}></div>
            <div class="vs-knob" style=${knobStyle}></div>
          </div>
        </div>
        <div class="vs-value" style="font-size:13px;font-weight:bold;color:${fg};">
          ${formatValue(value, step)}${unit}
        </div>
      </div>
    `;
  },
};

registry.register(valueSliderDef);
