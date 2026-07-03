import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, Dashboard } from "./types";
import {
  wsDashboardsList,
  wsDashboardGet,
  wsDashboardDelete,
  wsDashboardSave,
} from "./ha/websocket";
import { loadPlugins } from "./plugins/loader";
import "./editor/index";
import "./viewer/canvas";
import "./plugins/manager";

type View =
  | { mode: "list" }
  | { mode: "view"; dashboardId: string }
  | { mode: "edit"; dashboardId: string | null }
  | { mode: "plugins" };

export class VizlacePanel extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--primary-background-color, #121212);
      color: var(--primary-text-color, #fff);
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
      overflow: hidden;
    }

    /* ---- List view ---- */
    .list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background: var(--app-header-background-color, #1a1a2e);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .list-header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
    .btn-new {
      padding: 8px 18px;
      border-radius: 6px;
      border: none;
      background: var(--primary-color, #03a9f4);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .dashboard-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      padding: 24px;
      overflow-y: auto;
    }
    .dashboard-card {
      background: var(--ha-card-background, rgba(255,255,255,0.05));
      border-radius: 10px;
      padding: 20px;
      cursor: pointer;
      border: 1px solid rgba(255,255,255,0.08);
      transition: background 0.15s, border-color 0.15s;
    }
    .dashboard-card:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--primary-color, #03a9f4);
    }
    .card-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .card-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    .card-btn {
      flex: 1;
      padding: 5px 0;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.15);
      background: transparent;
      color: var(--primary-text-color, #fff);
      font-size: 12px;
      cursor: pointer;
    }
    .card-btn:hover {
      background: rgba(255,255,255,0.1);
    }
    .card-btn.danger:hover {
      background: rgba(244,67,54,0.2);
      color: #f44336;
      border-color: #f44336;
    }
    .empty-state {
      text-align: center;
      padding: 60px 24px;
      color: var(--secondary-text-color, #aaa);
    }
    .empty-state p {
      font-size: 16px;
      margin-bottom: 16px;
    }

    /* ---- Viewer ---- */
    .viewer-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      background: var(--app-header-background-color, #1a1a2e);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      flex-shrink: 0;
    }
    .viewer-header .title {
      font-size: 16px;
      font-weight: 600;
      flex: 1;
    }
    .btn-back,
    .btn-edit {
      padding: 6px 14px;
      border-radius: 5px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-back {
      background: rgba(255,255,255,0.1);
      color: var(--primary-text-color, #fff);
    }
    .btn-edit {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .viewer-body {
      flex: 1;
      overflow: auto;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 16px;
      color: var(--secondary-text-color, #aaa);
    }
  `;

  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) panel: unknown = null;

  @state() private view: View = { mode: "list" };
  @state() private dashboards: Dashboard[] = [];
  @state() private activeDashboard: Dashboard | null = null;
  @state() private loading = false;

  connectedCallback() {
    super.connectedCallback();
    this._loadList();
    loadPlugins(this.hass);
  }

  private async _loadList() {
    this.loading = true;
    try {
      const res = await wsDashboardsList(this.hass);
      this.dashboards = res.dashboards ?? [];
    } finally {
      this.loading = false;
    }
  }

  private async _openView(id: string) {
    this.loading = true;
    try {
      const res = await wsDashboardGet(this.hass, id);
      this.activeDashboard = res.dashboard;
      this.view = { mode: "view", dashboardId: id };
    } finally {
      this.loading = false;
    }
  }

  private async _openEdit(id: string | null) {
    if (id) {
      this.loading = true;
      try {
        const res = await wsDashboardGet(this.hass, id);
        this.activeDashboard = res.dashboard;
      } finally {
        this.loading = false;
      }
    } else {
      this.activeDashboard = {
        id: "",
        title: "New Dashboard",
        background: "",
        elements: [],
      };
    }
    this.view = { mode: "edit", dashboardId: id };
  }

  private async _delete(id: string) {
    if (!confirm("Delete this dashboard?")) return;
    await wsDashboardDelete(this.hass, id);
    this.dashboards = this.dashboards.filter((d) => d.id !== id);
  }

  private _backToList() {
    this.view = { mode: "list" };
    this._loadList();
  }

  private _renderList() {
    return html`
      <div class="list-header">
        <h1>Vizlace Dashboards</h1>
        <div style="display:flex;gap:8px;">
          ${this.hass?.user?.is_admin
            ? html`
                <button
                  class="card-btn"
                  style="flex:none;padding:8px 14px;"
                  @click=${() => (this.view = { mode: "plugins" })}
                >
                  Plugins
                </button>
              `
            : nothing}
          <button class="btn-new" @click=${() => this._openEdit(null)}>
            + New Dashboard
          </button>
        </div>
      </div>

      ${this.loading
        ? html`<div class="loading">Loading…</div>`
        : this.dashboards.length === 0
        ? html`
            <div class="empty-state">
              <p>No dashboards yet.</p>
              <button class="btn-new" @click=${() => this._openEdit(null)}>
                Create your first dashboard
              </button>
            </div>
          `
        : html`
            <div class="dashboard-list">
              ${this.dashboards.map(
                (d) => html`
                  <div class="dashboard-card" @click=${() => this._openView(d.id)}>
                    <div class="card-title">${d.title || "Unnamed"}</div>
                    <div
                      style="font-size:12px;color:var(--secondary-text-color,#aaa);"
                    >
                      ID: ${d.id.slice(0, 8)}…
                    </div>
                    <div class="card-actions">
                      <button
                        class="card-btn"
                        @click=${(e: Event) => {
                          e.stopPropagation();
                          this._openEdit(d.id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        class="card-btn danger"
                        @click=${(e: Event) => {
                          e.stopPropagation();
                          this._delete(d.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                `
              )}
            </div>
          `}
    `;
  }

  private _renderViewer() {
    if (!this.activeDashboard) return nothing;
    const db = this.activeDashboard;

    return html`
      <div class="viewer-header">
        <button class="btn-back" @click=${this._backToList}>← Back</button>
        <span class="title">${db.title}</span>
        <button
          class="btn-edit"
          @click=${() => this._openEdit(db.id)}
        >
          Edit
        </button>
      </div>
      <div class="viewer-body">
        <vizlace-viewer-canvas
          .dashboard=${db}
          .hass=${this.hass}
        ></vizlace-viewer-canvas>
      </div>
    `;
  }

  private _renderEditor() {
    if (!this.activeDashboard) return nothing;
    return html`
      <vizlace-editor
        .dashboard=${this.activeDashboard}
        .hass=${this.hass}
        @navigate-back=${this._backToList}
      ></vizlace-editor>
    `;
  }

  render() {
    const { mode } = this.view;
    if (mode === "list") return this._renderList();
    if (mode === "view") return this._renderViewer();
    if (mode === "edit") return this._renderEditor();
    if (mode === "plugins") {
      return html`
        <vizlace-plugin-manager
          .hass=${this.hass}
          @navigate-back=${this._backToList}
        ></vizlace-plugin-manager>
      `;
    }
    return nothing;
  }
}

customElements.define("vizlace-panel", VizlacePanel);
