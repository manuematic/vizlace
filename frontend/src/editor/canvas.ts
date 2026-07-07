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
  startX: number;
  startY: number;
  origins: Record<string, { x: number; y: number }>;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function rectsIntersect(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
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

const DEFAULT_GRID = 10;
const DEFAULT_CANVAS_WIDTH = 1600;
const DEFAULT_CANVAS_HEIGHT = 900;
const RESOLUTION_MARGIN = 200;

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
      background-image: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.07) 1px,
        transparent 1px
      );
    }
    .resolution-guide {
      position: absolute;
      left: 0;
      top: 0;
      box-sizing: border-box;
      border: 2px dashed var(--primary-color, #03a9f4);
      pointer-events: none;
      z-index: 1;
    }
    .resolution-label {
      position: absolute;
      top: -20px;
      left: 0;
      font-size: 11px;
      color: var(--primary-color, #03a9f4);
      background: rgba(0, 0, 0, 0.6);
      padding: 1px 6px;
      border-radius: 3px;
      white-space: nowrap;
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
    .marquee {
      position: absolute;
      border: 1px dashed var(--primary-color, #03a9f4);
      background: rgba(3, 169, 244, 0.15);
      pointer-events: none;
      z-index: 60;
    }
  `;

  @property({ attribute: false }) dashboard!: Dashboard;
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private selectedIds: string[] = [];
  @state() private marqueeRect: Rect | null = null;

  private drag: DragState | null = null;
  private resize: ResizeState | null = null;
  private marqueeStart: { x: number; y: number } | null = null;
  private marqueeCanvasRect: DOMRect | null = null;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("vizlace-registry-changed", this._onRegistryChanged);
  }

  disconnectedCallback() {
    window.removeEventListener("vizlace-registry-changed", this._onRegistryChanged);
    super.disconnectedCallback();
  }

  private _onRegistryChanged = () => this.requestUpdate();

  private _snap(v: number): number {
    if (this.dashboard.snapToGrid === false) return Math.round(v);
    const grid = this.dashboard.gridSize || DEFAULT_GRID;
    return Math.round(v / grid) * grid;
  }

  private _setSelection(ids: string[]) {
    this.selectedIds = ids;
    const elements = ids
      .map((id) => this.dashboard.elements.find((e) => e.id === id))
      .filter((e): e is ElementConfig => !!e);
    this.dispatchEvent(
      new CustomEvent("selection-changed", { detail: elements, bubbles: true })
    );
  }

  private _onPointerDown(e: PointerEvent, el: ElementConfig) {
    if ((e.target as HTMLElement).classList.contains("handle")) return;
    e.preventDefault();
    e.stopPropagation();

    if (e.shiftKey) {
      const set = new Set(this.selectedIds);
      if (set.has(el.id)) set.delete(el.id);
      else set.add(el.id);
      this._setSelection([...set]);
      return;
    }

    if (!this.selectedIds.includes(el.id)) {
      const ids = el.groupId
        ? this.dashboard.elements
            .filter((e2) => e2.groupId === el.groupId)
            .map((e2) => e2.id)
        : [el.id];
      this._setSelection(ids);
    }

    const origins: Record<string, { x: number; y: number }> = {};
    for (const id of this.selectedIds) {
      const e2 = this.dashboard.elements.find((x) => x.id === id);
      if (e2) origins[id] = { x: e2.x, y: e2.y };
    }
    this.drag = { startX: e.clientX, startY: e.clientY, origins };
    window.addEventListener("pointermove", this._onPointerMove);
    window.addEventListener("pointerup", this._onPointerUp, { once: true });
  }

  private _onCanvasPointerDown(e: PointerEvent) {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.marqueeCanvasRect = rect;
    this.marqueeStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    window.addEventListener("pointermove", this._onMarqueeMove);
    window.addEventListener("pointerup", this._onMarqueeUp, { once: true });
  }

  private _onMarqueeMove = (e: PointerEvent) => {
    if (!this.marqueeStart || !this.marqueeCanvasRect) return;
    const curX = e.clientX - this.marqueeCanvasRect.left;
    const curY = e.clientY - this.marqueeCanvasRect.top;
    const x = Math.min(this.marqueeStart.x, curX);
    const y = Math.min(this.marqueeStart.y, curY);
    const w = Math.abs(curX - this.marqueeStart.x);
    const h = Math.abs(curY - this.marqueeStart.y);
    this.marqueeRect = { x, y, w, h };
  };

  private _onMarqueeUp = () => {
    window.removeEventListener("pointermove", this._onMarqueeMove);
    const rect = this.marqueeRect;
    this.marqueeRect = null;
    this.marqueeStart = null;
    this.marqueeCanvasRect = null;
    if (rect && (rect.w > 4 || rect.h > 4)) {
      const ids = this.dashboard.elements
        .filter((el) =>
          rectsIntersect(rect, { x: el.x, y: el.y, w: el.width, h: el.height })
        )
        .map((el) => el.id);
      this._setSelection(ids);
    } else {
      this._setSelection([]);
    }
  };

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
      const origins = Object.values(this.drag.origins);
      let dx = e.clientX - this.drag.startX;
      let dy = e.clientY - this.drag.startY;
      const minOrigX = Math.min(...origins.map((o) => o.x));
      const minOrigY = Math.min(...origins.map((o) => o.y));
      dx = Math.max(dx, -minOrigX);
      dy = Math.max(dy, -minOrigY);
      const patches: Record<string, Partial<ElementConfig>> = {};
      for (const [id, origin] of Object.entries(this.drag.origins)) {
        patches[id] = {
          x: this._snap(origin.x + dx),
          y: this._snap(origin.y + dy),
        };
      }
      this._updateElements(patches);
    } else if (this.resize) {
      const r = this.resize;
      const dx = e.clientX - r.startX;
      const dy = e.clientY - r.startY;
      const patch: Partial<ElementConfig> = {};

      if (r.handle!.includes("e")) {
        patch.width = this._snap(Math.max(40, r.origW + dx));
      }
      if (r.handle!.includes("s")) {
        patch.height = this._snap(Math.max(30, r.origH + dy));
      }
      if (r.handle!.includes("w")) {
        const nw = this._snap(Math.max(40, r.origW - dx));
        patch.width = nw;
        patch.x = this._snap(r.origX + r.origW - nw);
      }
      if (r.handle!.includes("n")) {
        const nh = this._snap(Math.max(30, r.origH - dy));
        patch.height = nh;
        patch.y = this._snap(r.origY + r.origH - nh);
      }
      this._updateElement(r.elementId, patch);
    }
  };

  private _onPointerUp = () => {
    if (this.drag) {
      this.dispatchEvent(
        new CustomEvent("element-moved", { bubbles: true })
      );
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
    this._updateElements({ [id]: patch });
  }

  private _updateElements(patches: Record<string, Partial<ElementConfig>>) {
    const elements = this.dashboard.elements.map((el) =>
      patches[el.id] ? { ...el, ...patches[el.id] } : el
    );
    this.dashboard = { ...this.dashboard, elements };
    this.requestUpdate();
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

    const gridSize = this.dashboard.gridSize || DEFAULT_GRID;
    const screenW = this.dashboard.screenWidth;
    const screenH = this.dashboard.screenHeight;
    const canvasWidth = Math.max(
      DEFAULT_CANVAS_WIDTH,
      screenW ? screenW + RESOLUTION_MARGIN : 0
    );
    const canvasHeight = Math.max(
      DEFAULT_CANVAS_HEIGHT,
      screenH ? screenH + RESOLUTION_MARGIN : 0
    );

    return html`
      <div
        class="canvas"
        style=${styleMap({
          width: `${canvasWidth}px`,
          minHeight: `${canvasHeight}px`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        })}
        @pointerdown=${this._onCanvasPointerDown}
      >
        ${this.marqueeRect
          ? html`
              <div
                class="marquee"
                style=${styleMap({
                  left: `${this.marqueeRect.x}px`,
                  top: `${this.marqueeRect.y}px`,
                  width: `${this.marqueeRect.w}px`,
                  height: `${this.marqueeRect.h}px`,
                })}
              ></div>
            `
          : nothing}
        ${screenW && screenH
          ? html`
              <div
                class="resolution-guide"
                style=${styleMap({
                  width: `${screenW}px`,
                  height: `${screenH}px`,
                })}
              >
                <span class="resolution-label">${screenW} × ${screenH}</span>
              </div>
            `
          : nothing}
        ${this.dashboard.elements.map((el) => {
          const def = registry.get(el.type);
          const selected = this.selectedIds.includes(el.id);
          const entityState = el.entity_id
            ? this.hass?.states[el.entity_id] ?? null
            : null;
          const isFrame = el.type === "frame";

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
              <div
                class="element-inner"
                style=${styleMap({
                  background: isFrame ? "transparent" : undefined,
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
              ${selected && this.selectedIds.length === 1
                ? this._renderHandles(el)
                : nothing}
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
    this._setSelection([el.id]);
    this.requestUpdate();
  }

  updateSelectedElement(patch: Partial<ElementConfig>) {
    if (this.selectedIds.length !== 1) return;
    const id = this.selectedIds[0];
    this._updateElement(id, patch);
    this._setSelection([id]);
  }

  deleteElement(id: string) {
    this.dashboard = {
      ...this.dashboard,
      elements: this.dashboard.elements.filter((e) => e.id !== id),
    };
    if (this.selectedIds.includes(id)) {
      this._setSelection(this.selectedIds.filter((x) => x !== id));
    }
    this.requestUpdate();
  }

  groupElements(ids: string[]) {
    if (ids.length < 2) return;
    const groupId = `grp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const patches: Record<string, Partial<ElementConfig>> = {};
    for (const id of ids) patches[id] = { groupId };
    this._updateElements(patches);
    this._setSelection(ids);
  }

  ungroupElements(ids: string[]) {
    const patches: Record<string, Partial<ElementConfig>> = {};
    for (const id of ids) patches[id] = { groupId: undefined };
    this._updateElements(patches);
    this._setSelection(ids);
  }
}

customElements.define("vizlace-editor-canvas", VizlaceEditorCanvas);
