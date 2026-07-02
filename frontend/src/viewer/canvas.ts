import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { Dashboard, HomeAssistant } from "../types";
import { registry } from "../elements/registry";

export class VizlaceViewerCanvas extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .canvas {
      position: relative;
      width: 1600px;
      min-height: 900px;
    }
    .element-wrapper {
      position: absolute;
      overflow: hidden;
      border-radius: 6px;
      background: var(--ha-card-background, rgba(255, 255, 255, 0.05));
    }
  `;

  @property({ attribute: false }) dashboard!: Dashboard;
  @property({ attribute: false }) hass!: HomeAssistant;

  render() {
    if (!this.dashboard) return nothing;

    const bg = this.dashboard.background;

    return html`
      <div
        class="canvas"
        style=${bg ? `background:${bg};` : ""}
      >
        ${this.dashboard.elements.map((el) => {
          const def = registry.get(el.type);
          const entityState = el.entity_id
            ? this.hass?.states[el.entity_id] ?? null
            : null;

          return html`
            <div
              class="element-wrapper"
              style=${styleMap({
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                height: `${el.height}px`,
              })}
            >
              ${def
                ? def.render(el, entityState, this.hass)
                : html`<div
                    style="display:flex;align-items:center;justify-content:center;height:100%;color:#f55;font-size:12px;"
                  >
                    Unknown: ${el.type}
                  </div>`}
            </div>
          `;
        })}
      </div>
    `;
  }
}

customElements.define("vizlace-viewer-canvas", VizlaceViewerCanvas);
