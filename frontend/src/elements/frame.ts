import { html } from "lit";
import type { VizlaceElementDefinition } from "../types";
import { registry } from "./registry";

const frameDef: VizlaceElementDefinition = {
  type: "frame",
  label: "Rahmen",
  icon: "mdi:crop-free",
  defaultSize: { width: 300, height: 200 },
  defaultConfig: {
    borderWidth: 2,
    borderColor: "#03a9f4",
  },
  configFields: [
    {
      key: "borderWidth",
      label: "Randstärke (px)",
      type: "number",
      default: 2,
      min: 0,
      max: 20,
    },
    {
      key: "borderColor",
      label: "Randfarbe",
      type: "color",
      default: "#03a9f4",
    },
  ],
  render(config, _state, _hass) {
    const cfg = config.config;
    const borderWidth = Math.max(0, Math.min(20, Number(cfg.borderWidth ?? 2)));
    const borderColor = String(cfg.borderColor ?? "#03a9f4");

    return html`
      <div
        style="
          width:100%;height:100%;box-sizing:border-box;
          border:${borderWidth}px solid ${borderColor};
          background:transparent;
        "
      ></div>
    `;
  },
};

registry.register(frameDef);
