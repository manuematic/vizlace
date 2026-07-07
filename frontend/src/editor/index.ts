import { LitElement, html, css, nothing } from "lit";
import { property, state, query } from "lit/decorators.js";
import type { Dashboard, ElementConfig, HomeAssistant } from "../types";
import { registry } from "../elements/registry";
import { wsDashboardSave } from "../ha/websocket";
import "./canvas";
import "./toolbar";
import "./inspector";
import type { VizlaceEditorCanvas } from "./canvas";

export class VizlaceEditor extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .topbar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      background: var(--app-header-background-color, #1a1a2e);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }
    .topbar input[type="text"] {
      flex: 1;
      max-width: 300px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      color: var(--primary-text-color, #fff);
      padding: 6px 10px;
      font-size: 14px;
    }
    .btn {
      padding: 7px 16px;
      border-radius: 5px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-save {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .btn-save:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .btn-back {
      background: rgba(255, 255, 255, 0.1);
      color: var(--primary-text-color, #fff);
    }
    .status {
      font-size: 12px;
      color: var(--secondary-text-color, #aaa);
    }
    .main {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    vizlace-editor-canvas {
      flex: 1;
    }
  `;

  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) dashboard!: Dashboard;
  @state() private saving = false;
  @state() private saveStatus = "";
  @state() private selectedElements: ElementConfig[] = [];
  @query("vizlace-editor-canvas")
  private canvasEl!: VizlaceEditorCanvas;

  private async _save() {
    this.saving = true;
    this.saveStatus = "";
    try {
      const dashboard: Dashboard = {
        ...this.dashboard,
        elements: this.canvasEl.getElements(),
      };
      const result = await wsDashboardSave(this.hass, dashboard);
      this.dashboard = result.dashboard;
      this.saveStatus = "Saved!";
      setTimeout(() => (this.saveStatus = ""), 2000);
    } catch (e) {
      this.saveStatus = "Error saving";
    } finally {
      this.saving = false;
    }
  }

  private _syncElements() {
    this.dashboard = {
      ...this.dashboard,
      elements: this.canvasEl.getElements(),
    };
  }

  private _onAddElement(e: CustomEvent<{ type: string }>) {
    const def = registry.get(e.detail.type);
    if (!def) return;
    const id = `el_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newEl: ElementConfig = {
      id,
      type: e.detail.type,
      x: 80,
      y: 80,
      width: def.defaultSize.width,
      height: def.defaultSize.height,
      config: { ...def.defaultConfig },
    };
    this.canvasEl.addElement(newEl);
    this._syncElements();
  }

  private _onSelectionChanged(e: CustomEvent<ElementConfig[]>) {
    this.selectedElements = e.detail;
  }

  private _onElementChange(e: CustomEvent<ElementConfig>) {
    this.canvasEl.updateSelectedElement(e.detail);
    this.selectedElements = [e.detail];
    this._syncElements();
  }

  private _onElementDelete(e: CustomEvent<string>) {
    this.canvasEl.deleteElement(e.detail);
    this.selectedElements = [];
    this._syncElements();
  }

  private _onElementMoved() {
    this._syncElements();
  }

  private _onElementResized() {
    this._syncElements();
  }

  private _onGroupElements(e: CustomEvent<string[]>) {
    this.canvasEl.groupElements(e.detail);
    this._syncElements();
  }

  private _onUngroupElements(e: CustomEvent<string[]>) {
    this.canvasEl.ungroupElements(e.detail);
    this._syncElements();
  }

  private _onDashboardChange(e: CustomEvent<Partial<Dashboard>>) {
    this.dashboard = { ...this.dashboard, ...e.detail };
  }

  private _onTitleChange(e: Event) {
    this.dashboard = {
      ...this.dashboard,
      title: (e.target as HTMLInputElement).value,
    };
  }

  render() {
    return html`
      <div class="topbar">
        <button
          class="btn btn-back"
          @click=${() =>
            this.dispatchEvent(
              new CustomEvent("navigate-back", { bubbles: true, composed: true })
            )}
        >
          ← Back
        </button>
        <input
          type="text"
          placeholder="Dashboard title"
          .value=${this.dashboard?.title ?? ""}
          @input=${this._onTitleChange}
        />
        <button
          class="btn btn-save"
          ?disabled=${this.saving}
          @click=${this._save}
        >
          ${this.saving ? "Saving…" : "Save"}
        </button>
        ${this.saveStatus
          ? html`<span class="status">${this.saveStatus}</span>`
          : nothing}
      </div>

      <div
        class="main"
        @add-element=${this._onAddElement}
        @selection-changed=${this._onSelectionChanged}
        @element-change=${this._onElementChange}
        @element-delete=${this._onElementDelete}
        @element-moved=${this._onElementMoved}
        @element-resized=${this._onElementResized}
        @dashboard-change=${this._onDashboardChange}
        @group-elements=${this._onGroupElements}
        @ungroup-elements=${this._onUngroupElements}
      >
        <vizlace-editor-toolbar></vizlace-editor-toolbar>
        <vizlace-editor-canvas
          .dashboard=${this.dashboard}
          .hass=${this.hass}
        ></vizlace-editor-canvas>
        <vizlace-editor-inspector
          .elements=${this.selectedElements}
          .hass=${this.hass}
          .dashboard=${this.dashboard}
        ></vizlace-editor-inspector>
      </div>
    `;
  }
}

customElements.define("vizlace-editor", VizlaceEditor);
