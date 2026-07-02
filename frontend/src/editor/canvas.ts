import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { ElementConfig, Dashboard, HomeAssistant } from "../types";
import { registry } from "../elements/registry";

type ResizeHandle =
  | "nw"
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w"
  | null;

interface DragState {
  elementId: string;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
}

interface ResizeState {
  elementId: string;
  handle: ResizeHandle;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
}

const GRID = 10;
const snap = (v: number) => Math.round(v / GRID) * GRID;

export class VizlaceEditorCanvas extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      flex: 1;
      overflow: auto;
      background: var(--card-background-color, #1c1c1e);
    }
    .canvas {
      position: relative;
      width: 1600px;
      min-height: 900px;
      background-image: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.07) 1px,
        transparent 1px
      );
      background-size: 10px 10px;
    }
    .element-wrapper {
      position: absolute;
      cursor: move;
      user-select: none;
    }
    .element-wrapper.selected {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 1px;
    }
    .element-inner {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: var(--ha-card-background, rgba(255, 255, 255, 0.05));
      border-radius: 6px;
      pointer-events: none;
    }
    .element-inner.interactive {
      pointer-events: auto;
    }
    .handle {
      position: absolute;
      width: 10px;
      height: 10px;
      background: var(--primary-color, #03a9f4);
      border: 2px solid #fff;
      border-radius: 50%;
      z-index: 100;
      cursor: var(--handle-cursor, nwse-resize);
    }
    .handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
    .handle.n  { top: -5px; left: calc(50% - 5px); cursor: n-resize; }
    .handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
    .handle.e  { top: calc(50% - 5px); right: -5px; cursor: e-resize; }
    .handle.se { bottom: -5px; right: -5px; cursor: se-resize; }
    .handle.s  { bottom: -5px; left: calc(50% - 5px); cursor: s-resize; }
    .handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
    .handle.w  { top: calc(50% - 5px); left: -5px; cursor: w-resize; }
  `;

  @property({ attribute: false }) dashboard!: Dashboard;
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private selectedId: string | null = null;

  private drag: DragState | null = null;
  private resize: ResizeState | null = null;

  private _onPointerDown(e: PointerEvent, el: ElementConfig) {
    if ((e.target as HTMLElement).classList.contains("handle")) return;
    e.preventDefault();
    this.selectedId = el.id;
    this.dispatchEvent(
      new CustomEvent("element-selected", { detail: el, bubbles: true })
    );
    this.drag = {
      elementId: el.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.x,
      origY: el.y,
    };
    window.addEventListener("pointermove", this._onPointerMove);
    window.addEventListener("pointerup", this._onPointerUp, { once: true });
  }

  private _onResizeHandleDown(
    e: PointerEvent,
    el: ElementConfig,
    handle: ResizeHandle
  ) {
    e.preventDefault();
    e.stopPropagation();
    this.resize = {
      elementId: el.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.x,
      origY: el.y,
      origW: el.width,
      origH: el.height,
    };
    window.addEventListener("pointermove", this._onPointerMove);
    window.addEventListener("pointerup", this._onPointerUp, { once: true });
  }

  private _onPointerMove = (e: PointerEvent) => {
    if (this.drag) {
      const dx = e.clientX - this.drag.startX;
      const dy = e.clientY - this.drag.startY;
      this._updateElement(this.drag.elementId, {
        x: snap(Math.max(0, this.drag.origX + dx)),
        y: snap(Math.max(0, this.drag.origY + dy)),
      });
    } else if (this.resize) {
      const r = this.resize;
      const dx = e.clientX - r.startX;
      const dy = e.clientY - r.startY;
      const patch: Partial<ElementConfig> = {};

      if (r.handle!.includes("e")) {
        patch.width = snap(Math.max(40, r.origW + dx));
      }
      if (r.handle!.includes("s")) {
        patch.height = snap(Math.max(30, r.origH + dy));
      }
      if (r.handle!.includes("w")) {
        const nw = snap(Math.max(40, r.origW - dx));
        patch.width = nw;
        patch.x = snap(r.origX + r.origW - nw);
      }
      if (r.handle!.includes("n")) {
        const nh = snap(Math.max(30, r.origH - dy));
        patch.height = nh;
        patch.y = snap(r.origY + r.origH - nh);
      }
      this._updateElement(r.elementId, patch);
    }
  };

  private _onPointerUp = () => {
    if (this.drag) {
      const el = this.dashboard.elements.find((e) => e.id === this.drag!.elementId);
      if (el) {
        this.dispatchEvent(
          new CustomEvent("element-moved", { detail: el, bubbles: true })
        );
      }
    }
    if (this.resize) {
      const el = this.dashboard.elements.find(
        (e) => e.id === this.resize!.elementId
      );
      if (el) {
        this.dispatchEvent(
          new CustomEvent("element-resized", { detail: el, bubbles: true })
        );
      }
    }
    this.drag = null;
    this.resize = null;
    window.removeEventListener("pointermove", this._onPointerMove);
  };

  private _updateElement(id: string, patch: Partial<ElementConfig>) {
    const elements = this.dashboard.elements.map((el) =>
      el.id === id ? { ...el, ...patch } : el
    );
    this.dashboard = { ...this.dashboard, elements };
    this.requestUpdate();
  }

  private _onCanvasClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this.selectedId = null;
      this.dispatchEvent(
        new CustomEvent("element-selected", { detail: null, bubbles: true })
      );
    }
  }

  private _renderHandles(el: ElementConfig) {
    const handles: ResizeHandle[] = [
      "nw","n","ne","e","se","s","sw","w",
    ];
    return handles.map(
      (h) => html`
        <div
          class="handle ${h}"
          @pointerdown=${(e: PointerEvent) =>
            this._onResizeHandleDown(e, el, h)}
        ></div>
      `
    );
  }

  render() {
    if (!this.dashboard) return nothing;

    return html`
      <div class="canvas" @click=${this._onCanvasClick}>
        ${this.dashboard.elements.map((el) => {
          const def = registry.get(el.type);
          const selected = el.id === this.selectedId;
          const entityState = el.entity_id
            ? this.hass?.states[el.entity_id] ?? null
            : null;

          return html`
            <div
              class="element-wrapper ${selected ? "selected" : ""}"
              style=${styleMap({
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                height: `${el.height}px`,
                zIndex: selected ? "50" : "10",
              })}
              @pointerdown=${(e: PointerEvent) => this._onPointerDown(e, el)}
            >
              <div class="element-inner">
                ${def
                  ? def.render(el, entityState, this.hass)
                  : html`<div
                      style="display:flex;align-items:center;justify-content:center;height:100%;color:#f55;font-size:12px;"
                    >
                      Unknown: ${el.type}
                    </div>`}
              </div>
              ${selected ? this._renderHandles(el) : nothing}
            </div>
          `;
        })}
      </div>
    `;
  }

  getElements(): ElementConfig[] {
    return this.dashboard.elements;
  }

  addElement(el: ElementConfig) {
    this.dashboard = {
      ...this.dashboard,
      elements: [...this.dashboard.elements, el],
    };
    this.selectedId = el.id;
    this.dispatchEvent(
      new CustomEvent("element-selected", { detail: el, bubbles: true })
    );
    this.requestUpdate();
  }

  updateSelectedElement(patch: Partial<ElementConfig>) {
    if (!this.selectedId) return;
    this._updateElement(this.selectedId, patch);
    const el = this.dashboard.elements.find((e) => e.id === this.selectedId);
    if (el) {
      this.dispatchEvent(
        new CustomEvent("element-selected", { detail: el, bubbles: true })
      );
    }
  }

  deleteElement(id: string) {
    this.dashboard = {
      ...this.dashboard,
      elements: this.dashboard.elements.filter((e) => e.id !== id),
    };
    if (this.selectedId === id) this.selectedId = null;
    this.requestUpdate();
  }
}

customElements.define("vizlace-editor-canvas", VizlaceEditorCanvas);
