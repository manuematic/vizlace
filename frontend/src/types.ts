import type { TemplateResult } from "lit";
import type { HassEntity, HomeAssistant } from "./ha/types";

export type { HassEntity, HomeAssistant };

export interface ElementConfig {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  entity_id?: string;
  config: Record<string, unknown>;
}

export interface Dashboard {
  id: string;
  title: string;
  background: string;
  elements: ElementConfig[];
  gridSize?: number;
  snapToGrid?: boolean;
  screenWidth?: number;
  screenHeight?: number;
}

export interface ConfigField {
  key: string;
  label: string;
  type: "text" | "number" | "color" | "select" | "boolean";
  options?: { value: string; label: string }[];
  default?: unknown;
}

export interface VizlaceElementDefinition {
  type: string;
  label: string;
  icon: string;
  defaultSize: { width: number; height: number };
  defaultConfig: Record<string, unknown>;
  configFields: ConfigField[];
  render(
    config: ElementConfig,
    state: HassEntity | null,
    hass: HomeAssistant
  ): TemplateResult;
}
