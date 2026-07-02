import { html } from "lit";
import type { VizlaceElementDefinition } from "../types";
import { registry } from "./registry";

const heatingDef: VizlaceElementDefinition = {
  type: "heating",
  label: "Heating",
  icon: "mdi:thermometer",
  defaultSize: { width: 160, height: 180 },
  defaultConfig: {
    label: "Thermostat",
    min_temp: 5,
    max_temp: 35,
    step: 0.5,
  },
  configFields: [
    { key: "label", label: "Label", type: "text", default: "Thermostat" },
    { key: "min_temp", label: "Min Temp (°C)", type: "number", default: 5 },
    { key: "max_temp", label: "Max Temp (°C)", type: "number", default: 35 },
    { key: "step", label: "Step", type: "number", default: 0.5 },
  ],
  render(config, state, hass) {
    const cfg = config.config;
    const label = String(cfg.label ?? "Thermostat");
    const minTemp = Number(cfg.min_temp ?? 5);
    const maxTemp = Number(cfg.max_temp ?? 35);
    const step = Number(cfg.step ?? 0.5);

    const currentTemp = state
      ? (state.attributes["current_temperature"] as number | undefined) ??
        null
      : null;
    const setPoint = state
      ? (state.attributes["temperature"] as number | undefined) ?? null
      : null;

    const adjust = (delta: number) => (e: Event) => {
      e.stopPropagation();
      if (!config.entity_id || setPoint === null) return;
      const newTemp = Math.min(
        maxTemp,
        Math.max(minTemp, setPoint + delta)
      );
      hass.callService("climate", "set_temperature", {
        entity_id: config.entity_id,
        temperature: newTemp,
      });
    };

    return html`
      <div
        style="
          width:100%;height:100%;
          display:flex;flex-direction:column;
          align-items:center;justify-content:space-between;
          padding:8px;box-sizing:border-box;
          color:var(--primary-text-color,#fff);
        "
      >
        <div style="font-size:12px;color:var(--secondary-text-color,#aaa);">
          ${label}
        </div>

        <div
          style="font-size:13px;color:var(--secondary-text-color,#aaa);"
        >
          Current:
          <span style="font-weight:bold;color:var(--primary-text-color,#fff);">
            ${currentTemp !== null ? `${currentTemp}°C` : "—"}
          </span>
        </div>

        <div
          style="display:flex;align-items:center;gap:12px;"
        >
          <button
            @click=${adjust(-step)}
            style="
              width:36px;height:36px;border-radius:50%;
              border:none;background:rgba(255,255,255,0.12);
              color:var(--primary-text-color,#fff);
              font-size:22px;cursor:pointer;
              display:flex;align-items:center;justify-content:center;
            "
          >−</button>

          <div style="text-align:center;">
            <div
              style="font-size:28px;font-weight:bold;line-height:1;"
            >
              ${setPoint !== null ? `${setPoint}°C` : "—"}
            </div>
            <div
              style="font-size:10px;color:var(--secondary-text-color,#aaa);margin-top:2px;"
            >
              Set point
            </div>
          </div>

          <button
            @click=${adjust(step)}
            style="
              width:36px;height:36px;border-radius:50%;
              border:none;background:rgba(255,255,255,0.12);
              color:var(--primary-text-color,#fff);
              font-size:22px;cursor:pointer;
              display:flex;align-items:center;justify-content:center;
            "
          >+</button>
        </div>

        <div
          style="
            font-size:11px;color:var(--secondary-text-color,#aaa);
            padding:4px 8px;
            background:rgba(255,255,255,0.05);
            border-radius:4px;
          "
        >
          ${state?.state ?? "unavailable"}
        </div>
      </div>
    `;
  },
};

registry.register(heatingDef);
