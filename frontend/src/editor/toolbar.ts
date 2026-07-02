import { LitElement, html, css } from "lit";
import { registry } from "../elements/registry";

export class VizlaceEditorToolbar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 140px;
      background: var(--sidebar-background-color, #111);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px;
      box-sizing: border-box;
      overflow-y: auto;
    }
    .section-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--secondary-text-color, #aaa);
      margin: 8px 0 4px;
    }
    .element-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 8px 4px;
      margin-bottom: 4px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: var(--primary-text-color, #fff);
      cursor: pointer;
      font-size: 12px;
      transition: background 0.15s;
    }
    .element-btn:hover {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .icon {
      font-size: 20px;
    }
  `;

  render() {
    const elements = registry.getAll();
    return html`
      <div class="section-title">Elements</div>
      ${elements.map(
        (def) => html`
          <div
            class="element-btn"
            title="Add ${def.label}"
            @click=${() => this._addElement(def.type)}
          >
            <span class="icon">◻</span>
            <span>${def.label}</span>
          </div>
        `
      )}
    `;
  }

  private _addElement(type: string) {
    this.dispatchEvent(
      new CustomEvent("add-element", {
        detail: { type },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("vizlace-editor-toolbar", VizlaceEditorToolbar);
