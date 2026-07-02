import type { VizlaceElementDefinition } from "../types";

class ElementRegistry {
  private elements = new Map<string, VizlaceElementDefinition>();

  register(def: VizlaceElementDefinition): void {
    this.elements.set(def.type, def);
  }

  get(type: string): VizlaceElementDefinition | undefined {
    return this.elements.get(type);
  }

  getAll(): VizlaceElementDefinition[] {
    return Array.from(this.elements.values());
  }
}

export const registry = new ElementRegistry();

declare global {
  interface Window {
    vizlace: { registerElement: (def: VizlaceElementDefinition) => void };
  }
}

window.vizlace = {
  registerElement: (def) => registry.register(def),
};
