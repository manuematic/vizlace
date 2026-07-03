import { html, svg } from "lit";
import "./vizlace-panel";
import "./elements/gauge";
import "./elements/gauge-horizontal";
import "./elements/tricolor-gauge";
import "./elements/text-display";
import "./elements/button";
import "./elements/toggle-button";
import "./elements/color-field";
import "./elements/heating";
import "./elements/frame";

// Re-exported so community plugins can use Lit templates without bundling
// their own copy - see README "Community element API".
declare global {
  interface Window {
    lit: { html: typeof html; svg: typeof svg };
  }
}
window.lit = { html, svg };
