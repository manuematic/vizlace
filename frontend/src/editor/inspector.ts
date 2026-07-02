import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import type { ElementConfig } from "../types";
import { registry } from "../elements/registry";

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
      margin-top: 40px;
    }
  `;

  @property({ attribute: false }) element: ElementConfig | null = null;

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

  render() {
    if (!this.element) {
      return html`<div class="empty">Select an element to configure it.</div>`;
    }

    const el = this.element;
    const def = registry.get(el.type);

    return html`
      <h3>${def?.label ?? el.type}</h3>

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
        <input
          type="text"
          placeholder="e.g. sensor.temperature"
          .value=${el.entity_id ?? ""}
          @change=${(e: Event) =>
            this._patch({
              entity_id: (e.target as HTMLInputElement).value.trim() || undefined,
            })}
        />
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
                    .value=${String(val)}
                    @change=${(e: Event) => {
                      const raw = (e.target as HTMLInputElement).value;
                      this._patchConfig(
                        field.key,
                        field.type === "number" ? Number(raw) : raw
                      );
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
