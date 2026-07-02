import { html } from "lit";
import type { VizlaceElementDefinition } from "../types";
import { registry } from "./registry";

const colorFieldDef: VizlaceElementDefinition = {
  type: "color-field",
  label: "Color Field",
  icon: "mdi:palette",
  defaultSize: { width: 120, height: 120 },
  defaultConfig: {
    mode: "bw",
    on_color: "#ffffff",
    off_color: "#000000",
    label: "",
  },
  configFields: [
    {
      key: "mode",
      label: "Mode",
      type: "select",
      options: [
        { value: "bw", label: "On/Off (black & white)" },
        { value: "color", label: "Color from state" },
      ],
      default: "bw",
    },
    {
      key: "on_color",
      label: "On Color",
      type: "color",
      default: "#ffffff",
    },
    {
      key: "off_color",
      label: "Off Color",
      type: "color",
      default: "#000000",
    },
    { key: "label", label: "Label", type: "text", default: "" },
  ],
  render(config, state, _hass) {
    const cfg = config.config;
    const mode = String(cfg.mode ?? "bw");
    const onColor = String(cfg.on_color ?? "#ffffff");
    const offColor = String(cfg.off_color ?? "#000000");
    const label = String(cfg.label ?? "");

    let bgColor = offColor;

    if (state) {
      if (mode === "color") {
        bgColor = state.state;
      } else {
        bgColor =
          state.state === "on" || state.state === "true" ? onColor : offColor;
      }
    }

    return html`
      <div
        style="
          width:100%;height:100%;
          background:${bgColor};
          display:flex;
          align-items:flex-end;
          justify-content:center;
          padding:4px;
          box-sizing:border-box;
          border-radius:4px;
          transition:background 0.3s;
        "
      >
        ${label
          ? html`<span
              style="
                font-size:11px;
                color:${bgColor === "#ffffff" || bgColor === "#fff" ? "#000" : "#fff"};
                background:rgba(0,0,0,0.3);
                border-radius:3px;
                padding:1px 4px;
              "
              >${label}</span
            >`
          : ""}
      </div>
    `;
  },
};

registry.register(colorFieldDef);
