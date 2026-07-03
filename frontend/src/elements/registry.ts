import type { VizlaceElementDefinition } from "../types";

class ElementRegistry {
  private elements = new Map<string, VizlaceElementDefinition>();

  register(def: VizlaceElementDefinition): void {
    this.elements.set(def.type, def);
    // Plugins can register after toolbar/canvas have already rendered
    // (they load over WS, async) - this lets them pick the new type up.
    window.dispatchEvent(new CustomEvent("vizlace-registry-changed"));
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
