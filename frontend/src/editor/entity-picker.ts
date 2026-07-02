import { LitElement, html, css, nothing } from "lit";
import { property, state, query } from "lit/decorators.js";
import type { HomeAssistant } from "../types";

export class VizlaceEntityPicker extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    input {
      width: 100%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      color: var(--primary-text-color, #fff);
      padding: 5px 7px;
      font-size: 13px;
      box-sizing: border-box;
    }
    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 200;
      max-height: 220px;
      overflow-y: auto;
      background: var(--card-background-color, #1c1c1e);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      margin-top: 2px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
    .option {
      padding: 6px 8px;
      cursor: pointer;
      font-size: 12px;
    }
    .option .eid {
      display: block;
      color: var(--secondary-text-color, #aaa);
      font-size: 10px;
    }
    .option:hover,
    .option.active {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .option:hover .eid,
    .option.active .eid {
      color: rgba(255, 255, 255, 0.8);
    }
    .empty {
      padding: 8px;
      font-size: 12px;
      color: var(--secondary-text-color, #aaa);
    }
  `;

  @property({ attribute: false }) hass!: HomeAssistant;
  @property() value = "";

  @state() private open = false;
  @state() private queryText = "";
  @state() private activeIndex = -1;

  @query("input") private inputEl!: HTMLInputElement;

  private get _matches(): string[] {
    const q = this.queryText.trim().toLowerCase();
    const ids = Object.keys(this.hass?.states ?? {});
    return ids
      .map((id) => {
        const friendly = String(
          this.hass.states[id]?.attributes?.friendly_name ?? ""
        );
        const haystack = `${id} ${friendly}`.toLowerCase();
        return { id, idx: haystack.indexOf(q) };
      })
      .filter((m) => q === "" || m.idx !== -1)
      .sort((a, b) => a.idx - b.idx || a.id.localeCompare(b.id))
      .slice(0, 50)
      .map((m) => m.id);
  }

  private _openDropdown() {
    this.queryText = this.value;
    this.open = true;
    this.activeIndex = -1;
  }

  private _onInput(e: Event) {
    this.queryText = (e.target as HTMLInputElement).value;
    this.open = true;
    this.activeIndex = -1;
  }

  private _select(id: string) {
    this.value = id;
    this.queryText = id;
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: id },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onBlur() {
    // Delay so a click on a dropdown option (mousedown, prevented default)
    // still registers before we close and commit the typed text.
    setTimeout(() => {
      this.open = false;
      this._select(this.queryText.trim());
    }, 150);
  }

  private _onKeydown(e: KeyboardEvent) {
    const matches = this._matches;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.open = true;
      this.activeIndex = Math.min(this.activeIndex + 1, matches.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (this.activeIndex >= 0 && matches[this.activeIndex]) {
        this._select(matches[this.activeIndex]);
      } else {
        this._select(this.queryText.trim());
      }
      this.inputEl.blur();
    } else if (e.key === "Escape") {
      this.open = false;
      this.inputEl.blur();
    }
  }

  render() {
    const matches = this.open ? this._matches : [];
    return html`
      <input
        type="text"
        placeholder="e.g. sensor.temperature"
        .value=${this.open ? this.queryText : this.value}
        @focus=${this._openDropdown}
        @input=${this._onInput}
        @blur=${this._onBlur}
        @keydown=${this._onKeydown}
      />
      ${this.open
        ? html`
            <div class="dropdown">
              ${matches.length === 0
                ? html`<div class="empty">No matching entities</div>`
                : matches.map(
                    (id, i) => html`
                      <div
                        class="option ${i === this.activeIndex ? "active" : ""}"
                        @mousedown=${(e: Event) => {
                          e.preventDefault();
                          this._select(id);
                        }}
                      >
                        ${this.hass.states[id]?.attributes?.friendly_name ?? id}
                        <span class="eid">${id}</span>
                      </div>
                    `
                  )}
            </div>
          `
        : nothing}
    `;
  }
}

customElements.define("vizlace-entity-picker", VizlaceEntityPicker);
