import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import type { Dashboard, ElementConfig, HomeAssistant } from "../types";
import { registry } from "../elements/registry";
import "./entity-picker";

export class VizlaceEditorInspector extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 220px;
      background: var(--sidebar-background-color, #111);
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      padding: 12px;
      box-sizing: border-box;
      overflow-y: auto;
      color: var(--primary-text-color, #fff);
    }
    h3 {
      margin: 0 0 12px;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #fff);
    }
    .field-group {
      margin-bottom: 10px;
    }
    label {
      display: block;
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      margin-bottom: 3px;
    }
    input[type="text"],
    input[type="number"],
    input[type="color"],
    select {
      width: 100%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      color: var(--primary-text-color, #fff);
      padding: 5px 7px;
      font-size: 13px;
      box-sizing: border-box;
    }
    input[type="color"] {
      padding: 2px 4px;
      height: 32px;
      cursor: pointer;
    }
    input[type="checkbox"] {
      cursor: pointer;
    }
    .separator {
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin: 12px 0;
    }
    .pos-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }
    .btn-delete {
      width: 100%;
      padding: 7px;
      background: rgba(244, 67, 54, 0.2);
      border: 1px solid rgba(244, 67, 54, 0.4);
      border-radius: 4px;
      color: #f44336;
      cursor: pointer;
      font-size: 13px;
      margin-top: 12px;
    }
    .btn-delete:hover {
      background: rgba(244, 67, 54, 0.4);
    }
    .empty {
      font-size: 13px;
      color: var(--secondary-text-color, #aaa);
      text-align: center;
      margin-top: 8px;
      margin-bottom: 16px;
    }
    .hint {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      margin-top: -6px;
      margin-bottom: 10px;
    }
    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .checkbox-row label {
      margin-bottom: 0;
    }
    .btn-action {
      width: 100%;
      padding: 7px;
      background: rgba(3, 169, 244, 0.15);
      border: 1px solid rgba(3, 169, 244, 0.4);
      border-radius: 4px;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      font-size: 13px;
      margin-top: 12px;
    }
    .btn-action:hover {
      background: rgba(3, 169, 244, 0.3);
    }
    .group-note {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      margin-top: 8px;
    }
  `;

  @property({ attribute: false }) elements: ElementConfig[] = [];
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) dashboard!: Dashboard;

  private get element(): ElementConfig | null {
    return this.elements.length === 1 ? this.elements[0] : null;
  }

  private _patch(patch: Partial<ElementConfig>) {
    if (!this.element) return;
    this.dispatchEvent(
      new CustomEvent("element-change", {
        detail: { ...this.element, ...patch },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _patchConfig(key: string, value: unknown) {
    if (!this.element) return;
    this._patch({ config: { ...this.element.config, [key]: value } });
  }

  private _group() {
    this.dispatchEvent(
      new CustomEvent("group-elements", {
        detail: this.elements.map((e) => e.id),
        bubbles: true,
        composed: true,
      })
    );
  }

  private _ungroup(ids?: string[]) {
    this.dispatchEvent(
      new CustomEvent("ungroup-elements", {
        detail: ids ?? this.elements.map((e) => e.id),
        bubbles: true,
        composed: true,
      })
    );
  }

  private _groupMemberIds(groupId: string): string[] {
    return this.dashboard.elements
      .filter((e) => e.groupId === groupId)
      .map((e) => e.id);
  }

  private _patchDashboard(patch: Partial<Dashboard>) {
    this.dispatchEvent(
      new CustomEvent("dashboard-change", {
        detail: patch,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _renderDashboardSettings() {
    const db = this.dashboard;
    const gridSize = db?.gridSize ?? 10;
    const snapToGrid = db?.snapToGrid !== false;

    return html`
      <h3>Canvas Settings</h3>
      <div class="empty">Select an element to configure it.</div>

      <hr class="separator" />

      <div class="field-group">
        <label>Grid size (px)</label>
        <input
          type="number"
          min="2"
          .value=${String(gridSize)}
          @change=${(e: Event) => {
            const v = Number((e.target as HTMLInputElement).value);
            this._patchDashboard({ gridSize: v > 0 ? v : undefined });
          }}
        />
      </div>

      <div class="field-group checkbox-row">
        <input
          type="checkbox"
          id="snap-toggle"
          .checked=${snapToGrid}
          @change=${(e: Event) =>
            this._patchDashboard({
              snapToGrid: (e.target as HTMLInputElement).checked,
            })}
        />
        <label for="snap-toggle">Snap elements to grid</label>
      </div>

      <hr class="separator" />

      <label>Screen resolution guide</label>
      <div class="hint">Shown as a dashed outline on the canvas.</div>
      <div class="pos-grid">
        <div class="field-group">
          <label>Width (px)</label>
          <input
            type="number"
            min="0"
            .value=${String(db?.screenWidth ?? "")}
            @change=${(e: Event) => {
              const v = Number((e.target as HTMLInputElement).value);
              this._patchDashboard({ screenWidth: v > 0 ? v : undefined });
            }}
          />
        </div>
        <div class="field-group">
          <label>Height (px)</label>
          <input
            type="number"
            min="0"
            .value=${String(db?.screenHeight ?? "")}
            @change=${(e: Event) => {
              const v = Number((e.target as HTMLInputElement).value);
              this._patchDashboard({ screenHeight: v > 0 ? v : undefined });
            }}
          />
        </div>
      </div>
    `;
  }

  private _renderMultiSelection() {
    const count = this.elements.length;
    const groupIds = new Set(this.elements.map((e) => e.groupId));
    const isExistingGroup =
      groupIds.size === 1 && this.elements.every((e) => !!e.groupId);

    return html`
      <h3>${count} Elements Selected</h3>
      <div class="empty">
        Shift-click elements or drag a selection box on the canvas to adjust
        the selection.
      </div>

      <hr class="separator" />

      ${isExistingGroup
        ? html`
            <button class="btn-action" @click=${() => this._ungroup()}>
              Ungroup
            </button>
          `
        : html`
            <button class="btn-action" @click=${this._group}>
              Group (${count})
            </button>
          `}
    `;
  }

  render() {
    if (this.elements.length === 0) {
      return this._renderDashboardSettings();
    }

    if (this.elements.length > 1) {
      return this._renderMultiSelection();
    }

    const el = this.element!;
    const def = registry.get(el.type);

    return html`
      <h3>${def?.label ?? el.type}</h3>
      ${el.groupId
        ? html`
            <div class="group-note">
              Part of a group.
              <button
                class="btn-action"
                @click=${() => this._ungroup(this._groupMemberIds(el.groupId!))}
              >
                Ungroup
              </button>
            </div>
            <hr class="separator" />
          `
        : nothing}

      <!-- Position & size -->
      <label>Position & Size</label>
      <div class="pos-grid">
        <div class="field-group">
          <label>X</label>
          <input
            type="number"
            .value=${String(el.x)}
            @change=${(e: Event) =>
              this._patch({ x: Number((e.target as HTMLInputElement).value) })}
          />
        </div>
        <div class="field-group">
          <label>Y</label>
          <input
            type="number"
            .value=${String(el.y)}
            @change=${(e: Event) =>
              this._patch({ y: Number((e.target as HTMLInputElement).value) })}
          />
        </div>
        <div class="field-group">
          <label>Width</label>
          <input
            type="number"
            .value=${String(el.width)}
            @change=${(e: Event) =>
              this._patch({
                width: Number((e.target as HTMLInputElement).value),
              })}
          />
        </div>
        <div class="field-group">
          <label>Height</label>
          <input
            type="number"
            .value=${String(el.height)}
            @change=${(e: Event) =>
              this._patch({
                height: Number((e.target as HTMLInputElement).value),
              })}
          />
        </div>
      </div>

      <hr class="separator" />

      <!-- Entity -->
      <div class="field-group">
        <label>Entity ID</label>
        <vizlace-entity-picker
          .hass=${this.hass}
          .value=${el.entity_id ?? ""}
          @value-changed=${(e: CustomEvent<{ value: string }>) =>
            this._patch({ entity_id: e.detail.value.trim() || undefined })}
        ></vizlace-entity-picker>
      </div>

      ${def
        ? html`
            <hr class="separator" />
            ${def.configFields.map((field) => {
              const val = el.config[field.key] ?? field.default ?? "";

              if (field.type === "select" && field.options) {
                return html`
                  <div class="field-group">
                    <label>${field.label}</label>
                    <select
                      .value=${String(val)}
                      @change=${(e: Event) =>
                        this._patchConfig(
                          field.key,
                          (e.target as HTMLSelectElement).value
                        )}
                    >
                      ${field.options.map(
                        (o) => html`
                          <option
                            value=${o.value}
                            ?selected=${o.value === String(val)}
                          >
                            ${o.label}
                          </option>
                        `
                      )}
                    </select>
                  </div>
                `;
              }

              if (field.type === "boolean") {
                return html`
                  <div class="field-group">
                    <label>
                      <input
                        type="checkbox"
                        ?checked=${Boolean(val)}
                        @change=${(e: Event) =>
                          this._patchConfig(
                            field.key,
                            (e.target as HTMLInputElement).checked
                          )}
                      />
                      ${field.label}
                    </label>
                  </div>
                `;
              }

              return html`
                <div class="field-group">
                  <label>${field.label}</label>
                  <input
                    type=${field.type === "color"
                      ? "color"
                      : field.type === "number"
                      ? "number"
                      : "text"}
                    min=${field.min ?? nothing}
                    max=${field.max ?? nothing}
                    step=${field.step ?? nothing}
                    .value=${String(val)}
                    @change=${(e: Event) => {
                      const raw = (e.target as HTMLInputElement).value;
                      let parsed: unknown = raw;
                      if (field.type === "number") {
                        let n = Number(raw);
                        if (field.min !== undefined) n = Math.max(field.min, n);
                        if (field.max !== undefined) n = Math.min(field.max, n);
                        parsed = n;
                      }
                      this._patchConfig(field.key, parsed);
                    }}
                  />
                </div>
              `;
            })}
          `
        : nothing}

      <button
        class="btn-delete"
        @click=${() =>
          this.dispatchEvent(
            new CustomEvent("element-delete", {
              detail: el.id,
              bubbles: true,
              composed: true,
            })
          )}
      >
        Delete element
      </button>
    `;
  }
}

customElements.define("vizlace-editor-inspector", VizlaceEditorInspector);
