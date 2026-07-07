import { html } from "lit";
import type { VizlaceElementDefinition } from "../types";
import { registry } from "./registry";
import {
  styleConfigField,
  getStyle,
  controlBackground,
  controlBorder,
} from "./styles";

const slideToggleDef: VizlaceElementDefinition = {
  type: "slide-toggle",
  label: "Schiebeschalter",
  icon: "mdi:toggle-switch-outline",
  defaultSize: { width: 100, height: 44 },
  defaultConfig: {
    on_color: "#4caf50",
    off_color: "#757575",
    knob_color: "#ffffff",
  },
  configFields: [
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
    {
      key: "knob_color",
      label: "Knopf-Farbe",
      type: "color",
      default: "#ffffff",
    },
    styleConfigField,
  ],
  render(config, state, hass) {
    const cfg = config.config;
    const onColor = String(cfg.on_color ?? "#4caf50");
    const offColor = String(cfg.off_color ?? "#757575");
    const knobColor = String(cfg.knob_color ?? "#ffffff");
    const style = getStyle(cfg);
    const radius = style === "mondrian" ? "0" : "999px";

    const isOn = state ? state.state === "on" || state.state === "true" : false;
    const trackColorValue = isOn ? onColor : offColor;

    const handleClick = (e: Event) => {
      e.stopPropagation();
      if (!config.entity_id) return;
      hass.callService("homeassistant", "toggle", {
        entity_id: config.entity_id,
      });
    };

    return html`
      <div
        style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;"
      >
        <div
          @click=${handleClick}
          style="
            position:relative;
            width:90%;
            height:70%;
            max-height:36px;
            box-sizing:border-box;
            border-radius:${radius};
            background:${controlBackground(style, trackColorValue)};
            border:${controlBorder(style)};
            box-shadow:inset 0 1px 3px rgba(0,0,0,0.4);
            cursor:pointer;
            transition:background 0.2s;
          "
        >
          <div
            style="
              position:absolute;
              top:2px;
              bottom:2px;
              width:calc(50% - 2px);
              left:${isOn ? "calc(50% + 0px)" : "2px"};
              border-radius:${radius};
              background:${controlBackground(style, knobColor)};
              border:${style === "mondrian" ? "3px solid #111" : "none"};
              box-shadow:0 1px 3px rgba(0,0,0,0.5);
              transition:left 0.18s ease;
            "
          ></div>
        </div>
      </div>
    `;
  },
};

registry.register(slideToggleDef);
