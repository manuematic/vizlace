import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, PluginRecord } from "../types";
import { wsPluginsList, wsPluginUpload, wsPluginDelete } from "../ha/websocket";

export class VizlacePluginManager extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--primary-background-color, #121212);
      color: var(--primary-text-color, #fff);
      overflow-y: auto;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      background: var(--app-header-background-color, #1a1a2e);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
    .btn-back {
      padding: 6px 14px;
      border-radius: 5px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: var(--primary-text-color, #fff);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .warning {
      margin: 20px 24px 0;
      padding: 12px 16px;
      border-radius: 8px;
      background: rgba(255, 152, 0, 0.15);
      border: 1px solid rgba(255, 152, 0, 0.4);
      color: #ffb74d;
      font-size: 13px;
      line-height: 1.5;
    }
    .upload-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 16px 24px;
    }
    .btn-upload {
      display: inline-block;
      padding: 8px 18px;
      border-radius: 6px;
      background: var(--primary-color, #03a9f4);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .upload-error {
      color: #f44336;
      font-size: 13px;
    }
    .readonly-note {
      margin: 16px 24px;
      font-size: 13px;
      color: var(--secondary-text-color, #aaa);
    }
    .plugin-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
      padding: 8px 24px 24px;
    }
    .plugin-card {
      background: var(--ha-card-background, rgba(255, 255, 255, 0.05));
      border-radius: 10px;
      padding: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .plugin-name {
      font-size: 14px;
      font-weight: 600;
      word-break: break-all;
    }
    .plugin-meta {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      margin-top: 6px;
    }
    .btn-delete {
      margin-top: 12px;
      width: 100%;
      padding: 6px 0;
      border-radius: 4px;
      border: 1px solid rgba(244, 67, 54, 0.4);
      background: rgba(244, 67, 54, 0.15);
      color: #f44336;
      font-size: 12px;
      cursor: pointer;
    }
    .btn-delete:hover {
      background: rgba(244, 67, 54, 0.3);
    }
    .empty,
    .loading {
      padding: 40px 24px;
      text-align: center;
      color: var(--secondary-text-color, #aaa);
    }
  `;

  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private plugins: PluginRecord[] = [];
  @state() private loading = false;
  @state() private uploadError: string | null = null;

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  private async _load() {
    this.loading = true;
    try {
      const res = await wsPluginsList(this.hass);
      this.plugins = res.plugins;
    } finally {
      this.loading = false;
    }
  }

  private _onFileChange = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    this.uploadError = null;
    try {
      const code = await file.text();
      await wsPluginUpload(this.hass, file.name, code);
      await this._load();
    } catch (err) {
      this.uploadError =
        err instanceof Error ? err.message : "Upload fehlgeschlagen";
    }
  };

  private async _delete(plugin: PluginRecord) {
    if (
      !confirm(
        `Plugin "${plugin.filename}" wirklich entfernen? Elemente, die es bereitstellt, verschwinden aus der Toolbox (bereits platzierte Instanzen auf Dashboards bleiben als "Unknown" stehen).`
      )
    )
      return;
    await wsPluginDelete(this.hass, plugin.id);
    this.plugins = this.plugins.filter((p) => p.id !== plugin.id);
  }

  private _back() {
    this.dispatchEvent(
      new CustomEvent("navigate-back", { bubbles: true, composed: true })
    );
  }

  render() {
    const isAdmin = Boolean(this.hass?.user?.is_admin);

    return html`
      <div class="header">
        <button class="btn-back" @click=${this._back}>← Zurück</button>
        <h1>Plugins</h1>
      </div>

      <div class="warning">
        ⚠️ Plugins sind JavaScript-Dateien, die mit vollem Zugriff auf deine
        Home-Assistant-Entities und -Services laufen. Installiere nur Plugins
        aus vertrauenswürdigen Quellen.
      </div>

      ${isAdmin
        ? html`
            <div class="upload-row">
              <label class="btn-upload">
                + Plugin hochladen (.js)
                <input
                  type="file"
                  accept=".js,application/javascript"
                  hidden
                  @change=${this._onFileChange}
                />
              </label>
              ${this.uploadError
                ? html`<span class="upload-error">${this.uploadError}</span>`
                : nothing}
            </div>
          `
        : html`
            <div class="readonly-note">
              Nur Administratoren können Plugins installieren oder entfernen.
            </div>
          `}
      ${this.loading
        ? html`<div class="loading">Lädt…</div>`
        : this.plugins.length === 0
        ? html`<div class="empty">Noch keine Plugins installiert.</div>`
        : html`
            <div class="plugin-list">
              ${this.plugins.map(
                (p) => html`
                  <div class="plugin-card">
                    <div class="plugin-name">${p.filename}</div>
                    <div class="plugin-meta">
                      Installiert: ${new Date(p.installed_at).toLocaleString()}
                    </div>
                    ${isAdmin
                      ? html`
                          <button
                            class="btn-delete"
                            @click=${() => this._delete(p)}
                          >
                            Entfernen
                          </button>
                        `
                      : nothing}
                  </div>
                `
              )}
            </div>
          `}
    `;
  }
}

customElements.define("vizlace-plugin-manager", VizlacePluginManager);
