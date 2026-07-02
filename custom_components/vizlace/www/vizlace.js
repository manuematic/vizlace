/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
const t$2 = globalThis, e$5 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$5 = /* @__PURE__ */ new WeakMap();
let n$4 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$5 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$5.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$5.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$4 = (t2) => new n$4("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$5 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$4(o2, t2, s$2);
}, S$1 = (s2, o2) => {
  if (e$5) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$5 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$4(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$4, defineProperty: e$4, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$3, getOwnPropertySymbols: o$4, getPrototypeOf: n$3 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i4 = t2;
  switch (s2) {
    case Boolean:
      i4 = null !== t2;
      break;
    case Number:
      i4 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i4 = JSON.parse(t2);
      } catch (t3) {
        i4 = null;
      }
  }
  return i4;
} }, f$1 = (t2, s2) => !i$4(t2, s2), b$1 = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b$1) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i4 = Symbol(), h2 = this.getPropertyDescriptor(t2, i4, s2);
      void 0 !== h2 && e$4(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i4) {
    const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2 == null ? void 0 : e2.call(this);
      r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i4);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b$1;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$3(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$3(t3), ...o$4(t3)];
      for (const i4 of s2) this.createProperty(i4, t3[i4]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i4] of s2) this.elementProperties.set(t3, i4);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i4 = this._$Eu(t3, s2);
      void 0 !== i4 && this._$Eh.set(i4, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i4 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i4.unshift(c$2(s3));
    } else void 0 !== s2 && i4.push(c$2(s2));
    return i4;
  }
  static _$Eu(t2, s2) {
    const i4 = s2.attribute;
    return false === i4 ? void 0 : "string" == typeof i4 ? i4 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i4 of s2.keys()) this.hasOwnProperty(i4) && (t2.set(i4, this[i4]), delete this[i4]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i4) {
    this._$AK(t2, i4);
  }
  _$ET(t2, s2) {
    var _a2;
    const i4 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i4);
    if (void 0 !== e2 && true === i4.reflect) {
      const h2 = (void 0 !== ((_a2 = i4.converter) == null ? void 0 : _a2.toAttribute) ? i4.converter : u$1).toAttribute(s2, i4.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2, _b;
    const i4 = this.constructor, e2 = i4._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i4.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
      this._$Em = e2;
      const r2 = h2.fromAttribute(s2, t3.type);
      this[e2] = r2 ?? ((_b = this._$Ej) == null ? void 0 : _b.get(e2)) ?? r2, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i4, e2 = false, h2) {
    var _a2;
    if (void 0 !== t2) {
      const r2 = this.constructor;
      if (false === e2 && (h2 = this[t2]), i4 ?? (i4 = r2.getPropertyOptions(t2)), !((i4.hasChanged ?? f$1)(h2, s2) || i4.useDefault && i4.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(r2._$Eu(t2, i4)))) return;
      this.C(t2, s2, i4);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i4, reflect: e2, wrapped: h2 }, r2) {
    i4 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i4 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i4] of t3) {
        const { wrapped: t4 } = i4, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i4, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$3 = (t2) => t2, s$1 = t$1.trustedTypes, e$3 = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, h = "$lit$", o$3 = `lit$${Math.random().toFixed(9).slice(2)}$`, n$2 = "?" + o$3, r$2 = `<${n$2}>`, l = document, c = () => l.createComment(""), a = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, u = Array.isArray, d = (t2) => u(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), f = "[ 	\n\f\r]", v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m = />/g, p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $ = /"/g, y2 = /^(?:script|style|textarea|title)$/i, x = (t2) => (i4, ...s2) => ({ _$litType$: t2, strings: i4, values: s2 }), b = x(1), w = x(2), E = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), C = /* @__PURE__ */ new WeakMap(), P = l.createTreeWalker(l, 129);
function V(t2, i4) {
  if (!u(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e$3 ? e$3.createHTML(i4) : i4;
}
const N = (t2, i4) => {
  const s2 = t2.length - 1, e2 = [];
  let n3, l2 = 2 === i4 ? "<svg>" : 3 === i4 ? "<math>" : "", c2 = v;
  for (let i5 = 0; i5 < s2; i5++) {
    const s3 = t2[i5];
    let a2, u2, d2 = -1, f2 = 0;
    for (; f2 < s3.length && (c2.lastIndex = f2, u2 = c2.exec(s3), null !== u2); ) f2 = c2.lastIndex, c2 === v ? "!--" === u2[1] ? c2 = _ : void 0 !== u2[1] ? c2 = m : void 0 !== u2[2] ? (y2.test(u2[2]) && (n3 = RegExp("</" + u2[2], "g")), c2 = p) : void 0 !== u2[3] && (c2 = p) : c2 === p ? ">" === u2[0] ? (c2 = n3 ?? v, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? p : '"' === u2[3] ? $ : g) : c2 === $ || c2 === g ? c2 = p : c2 === _ || c2 === m ? c2 = v : (c2 = p, n3 = void 0);
    const x2 = c2 === p && t2[i5 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === v ? s3 + r$2 : d2 >= 0 ? (e2.push(a2), s3.slice(0, d2) + h + s3.slice(d2) + o$3 + x2) : s3 + o$3 + (-2 === d2 ? i5 : x2);
  }
  return [V(t2, l2 + (t2[s2] || "<?>") + (2 === i4 ? "</svg>" : 3 === i4 ? "</math>" : "")), e2];
};
class S {
  constructor({ strings: t2, _$litType$: i4 }, e2) {
    let r2;
    this.parts = [];
    let l2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = N(t2, i4);
    if (this.el = S.createElement(f2, e2), P.currentNode = this.el.content, 2 === i4 || 3 === i4) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = P.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(h)) {
          const i5 = v2[a2++], s2 = r2.getAttribute(t3).split(o$3), e3 = /([.?@])?(.*)/.exec(i5);
          d2.push({ type: 1, index: l2, name: e3[2], strings: s2, ctor: "." === e3[1] ? I : "?" === e3[1] ? L : "@" === e3[1] ? z : H }), r2.removeAttribute(t3);
        } else t3.startsWith(o$3) && (d2.push({ type: 6, index: l2 }), r2.removeAttribute(t3));
        if (y2.test(r2.tagName)) {
          const t3 = r2.textContent.split(o$3), i5 = t3.length - 1;
          if (i5 > 0) {
            r2.textContent = s$1 ? s$1.emptyScript : "";
            for (let s2 = 0; s2 < i5; s2++) r2.append(t3[s2], c()), P.nextNode(), d2.push({ type: 2, index: ++l2 });
            r2.append(t3[i5], c());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === n$2) d2.push({ type: 2, index: l2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(o$3, t3 + 1)); ) d2.push({ type: 7, index: l2 }), t3 += o$3.length - 1;
      }
      l2++;
    }
  }
  static createElement(t2, i4) {
    const s2 = l.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function M(t2, i4, s2 = t2, e2) {
  var _a2, _b;
  if (i4 === E) return i4;
  let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
  const o2 = a(i4) ? void 0 : i4._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i4 = M(t2, h2._$AS(t2, i4.values), h2, e2)), i4;
}
class R {
  constructor(t2, i4) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i4;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i4 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? l).importNode(i4, true);
    P.currentNode = e2;
    let h2 = P.nextNode(), o2 = 0, n3 = 0, r2 = s2[0];
    for (; void 0 !== r2; ) {
      if (o2 === r2.index) {
        let i5;
        2 === r2.type ? i5 = new k(h2, h2.nextSibling, this, t2) : 1 === r2.type ? i5 = new r2.ctor(h2, r2.name, r2.strings, this, t2) : 6 === r2.type && (i5 = new Z(h2, this, t2)), this._$AV.push(i5), r2 = s2[++n3];
      }
      o2 !== (r2 == null ? void 0 : r2.index) && (h2 = P.nextNode(), o2++);
    }
    return P.currentNode = l, e2;
  }
  p(t2) {
    let i4 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i4), i4 += s2.strings.length - 2) : s2._$AI(t2[i4])), i4++;
  }
}
class k {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i4, s2, e2) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t2, this._$AB = i4, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i4 = this._$AM;
    return void 0 !== i4 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i4.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i4 = this) {
    t2 = M(this, t2, i4), a(t2) ? t2 === A || null == t2 || "" === t2 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t2 !== this._$AH && t2 !== E && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : d(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(l.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i4, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = S.createElement(V(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i4);
    else {
      const t3 = new R(e2, this), s3 = t3.u(this.options);
      t3.p(i4), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i4 = C.get(t2.strings);
    return void 0 === i4 && C.set(t2.strings, i4 = new S(t2)), i4;
  }
  k(t2) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i4 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i4.length ? i4.push(s2 = new k(this.O(c()), this.O(c()), this, this.options)) : s2 = i4[e2], s2._$AI(h2), e2++;
    e2 < i4.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i4.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, s2) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, s2); t2 !== this._$AB; ) {
      const s3 = i$3(t2).nextSibling;
      i$3(t2).remove(), t2 = s3;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
}
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i4, s2, e2, h2) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t2, this.name = i4, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = A;
  }
  _$AI(t2, i4 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = M(this, t2, i4, 0), o2 = !a(t2) || t2 !== this._$AH && t2 !== E, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = M(this, e3[s2 + n3], i4, n3), r2 === E && (r2 = this._$AH[n3]), o2 || (o2 = !a(r2) || r2 !== this._$AH[n3]), r2 === A ? t2 = A : t2 !== A && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class I extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === A ? void 0 : t2;
  }
}
class L extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== A);
  }
}
class z extends H {
  constructor(t2, i4, s2, e2, h2) {
    super(t2, i4, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i4 = this) {
    if ((t2 = M(this, t2, i4, 0) ?? A) === E) return;
    const s2 = this._$AH, e2 = t2 === A && s2 !== A || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== A && (s2 === A || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class Z {
  constructor(t2, i4, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    M(this, t2);
  }
}
const B = t$1.litHtmlPolyfillSupport;
B == null ? void 0 : B(S, k), (t$1.litHtmlVersions ?? (t$1.litHtmlVersions = [])).push("3.3.3");
const D = (t2, i4, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i4;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new k(i4.insertBefore(c(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
let i$2 = class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = D(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return E;
  }
};
i$2._$litElement$ = true, i$2["finalized"] = true, (_a = s.litElementHydrateSupport) == null ? void 0 : _a.call(s, { LitElement: i$2 });
const o$2 = s.litElementPolyfillSupport;
o$2 == null ? void 0 : o$2({ LitElement: i$2 });
(s.litElementVersions ?? (s.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o$1 = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o$1, e2, r2) => {
  const { kind: n3, metadata: i4 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i4);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i4, s2 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    }, init(e3) {
      return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n$1(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r(r2) {
  return n$1({ ...r2, state: true, attribute: false });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$2 = (e2, t2, c2) => (c2.configurable = true, c2.enumerable = true, Reflect.decorate && "object" != typeof t2 && Object.defineProperty(e2, t2, c2), c2);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function e$1(e2, r2) {
  return (n3, s2, i4) => {
    const o2 = (t2) => {
      var _a2;
      return ((_a2 = t2.renderRoot) == null ? void 0 : _a2.querySelector(e2)) ?? null;
    };
    return e$2(n3, s2, { get() {
      return o2(this);
    } });
  };
}
async function wsDashboardsList(hass) {
  return hass.callWS({ type: "vizlace/dashboards/list" });
}
async function wsDashboardGet(hass, id) {
  return hass.callWS({ type: "vizlace/dashboard/get", id });
}
async function wsDashboardSave(hass, dashboard) {
  return hass.callWS({
    type: "vizlace/dashboard/save",
    dashboard
  });
}
async function wsDashboardDelete(hass, id) {
  await hass.callWS({ type: "vizlace/dashboard/delete", id });
}
class ElementRegistry {
  constructor() {
    this.elements = /* @__PURE__ */ new Map();
  }
  register(def) {
    this.elements.set(def.type, def);
  }
  get(type) {
    return this.elements.get(type);
  }
  getAll() {
    return Array.from(this.elements.values());
  }
}
const registry = new ElementRegistry();
window.vizlace = {
  registerElement: (def) => registry.register(def)
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = { ATTRIBUTE: 1 }, e = (t2) => (...e2) => ({ _$litDirective$: t2, values: e2 });
let i$1 = class i2 {
  constructor(t2) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t2, e2, i4) {
    this._$Ct = t2, this._$AM = e2, this._$Ci = i4;
  }
  _$AS(t2, e2) {
    return this.update(t2, e2);
  }
  update(t2, e2) {
    return this.render(...e2);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const n2 = "important", i3 = " !" + n2, o = e(class extends i$1 {
  constructor(t$12) {
    var _a2;
    if (super(t$12), t$12.type !== t.ATTRIBUTE || "style" !== t$12.name || ((_a2 = t$12.strings) == null ? void 0 : _a2.length) > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t2) {
    return Object.keys(t2).reduce((e2, r2) => {
      const s2 = t2[r2];
      return null == s2 ? e2 : e2 + `${r2 = r2.includes("-") ? r2 : r2.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s2};`;
    }, "");
  }
  update(e2, [r2]) {
    const { style: s2 } = e2.element;
    if (void 0 === this.ft) return this.ft = new Set(Object.keys(r2)), this.render(r2);
    for (const t2 of this.ft) null == r2[t2] && (this.ft.delete(t2), t2.includes("-") ? s2.removeProperty(t2) : s2[t2] = null);
    for (const t2 in r2) {
      const e3 = r2[t2];
      if (null != e3) {
        this.ft.add(t2);
        const r3 = "string" == typeof e3 && e3.endsWith(i3);
        t2.includes("-") || r3 ? s2.setProperty(t2, r3 ? e3.slice(0, -11) : e3, r3 ? n2 : "") : s2[t2] = e3;
      }
    }
    return E;
  }
});
var __defProp$4 = Object.defineProperty;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(target, key, result) || result;
  if (result) __defProp$4(target, key, result);
  return result;
};
const GRID = 10;
const snap = (v2) => Math.round(v2 / GRID) * GRID;
const _VizlaceEditorCanvas = class _VizlaceEditorCanvas extends i$2 {
  constructor() {
    super(...arguments);
    this.selectedId = null;
    this.drag = null;
    this.resize = null;
    this._onPointerMove = (e2) => {
      if (this.drag) {
        const dx = e2.clientX - this.drag.startX;
        const dy = e2.clientY - this.drag.startY;
        this._updateElement(this.drag.elementId, {
          x: snap(Math.max(0, this.drag.origX + dx)),
          y: snap(Math.max(0, this.drag.origY + dy))
        });
      } else if (this.resize) {
        const r2 = this.resize;
        const dx = e2.clientX - r2.startX;
        const dy = e2.clientY - r2.startY;
        const patch = {};
        if (r2.handle.includes("e")) {
          patch.width = snap(Math.max(40, r2.origW + dx));
        }
        if (r2.handle.includes("s")) {
          patch.height = snap(Math.max(30, r2.origH + dy));
        }
        if (r2.handle.includes("w")) {
          const nw = snap(Math.max(40, r2.origW - dx));
          patch.width = nw;
          patch.x = snap(r2.origX + r2.origW - nw);
        }
        if (r2.handle.includes("n")) {
          const nh = snap(Math.max(30, r2.origH - dy));
          patch.height = nh;
          patch.y = snap(r2.origY + r2.origH - nh);
        }
        this._updateElement(r2.elementId, patch);
      }
    };
    this._onPointerUp = () => {
      if (this.drag) {
        const el = this.dashboard.elements.find((e2) => e2.id === this.drag.elementId);
        if (el) {
          this.dispatchEvent(
            new CustomEvent("element-moved", { detail: el, bubbles: true })
          );
        }
      }
      if (this.resize) {
        const el = this.dashboard.elements.find(
          (e2) => e2.id === this.resize.elementId
        );
        if (el) {
          this.dispatchEvent(
            new CustomEvent("element-resized", { detail: el, bubbles: true })
          );
        }
      }
      this.drag = null;
      this.resize = null;
      window.removeEventListener("pointermove", this._onPointerMove);
    };
  }
  _onPointerDown(e2, el) {
    if (e2.target.classList.contains("handle")) return;
    e2.preventDefault();
    this.selectedId = el.id;
    this.dispatchEvent(
      new CustomEvent("element-selected", { detail: el, bubbles: true })
    );
    this.drag = {
      elementId: el.id,
      startX: e2.clientX,
      startY: e2.clientY,
      origX: el.x,
      origY: el.y
    };
    window.addEventListener("pointermove", this._onPointerMove);
    window.addEventListener("pointerup", this._onPointerUp, { once: true });
  }
  _onResizeHandleDown(e2, el, handle) {
    e2.preventDefault();
    e2.stopPropagation();
    this.resize = {
      elementId: el.id,
      handle,
      startX: e2.clientX,
      startY: e2.clientY,
      origX: el.x,
      origY: el.y,
      origW: el.width,
      origH: el.height
    };
    window.addEventListener("pointermove", this._onPointerMove);
    window.addEventListener("pointerup", this._onPointerUp, { once: true });
  }
  _updateElement(id, patch) {
    const elements = this.dashboard.elements.map(
      (el) => el.id === id ? { ...el, ...patch } : el
    );
    this.dashboard = { ...this.dashboard, elements };
    this.requestUpdate();
  }
  _onCanvasClick(e2) {
    if (e2.target === e2.currentTarget) {
      this.selectedId = null;
      this.dispatchEvent(
        new CustomEvent("element-selected", { detail: null, bubbles: true })
      );
    }
  }
  _renderHandles(el) {
    const handles = [
      "nw",
      "n",
      "ne",
      "e",
      "se",
      "s",
      "sw",
      "w"
    ];
    return handles.map(
      (h2) => b`
        <div
          class="handle ${h2}"
          @pointerdown=${(e2) => this._onResizeHandleDown(e2, el, h2)}
        ></div>
      `
    );
  }
  render() {
    if (!this.dashboard) return A;
    return b`
      <div class="canvas" @click=${this._onCanvasClick}>
        ${this.dashboard.elements.map((el) => {
      var _a2;
      const def = registry.get(el.type);
      const selected = el.id === this.selectedId;
      const entityState = el.entity_id ? ((_a2 = this.hass) == null ? void 0 : _a2.states[el.entity_id]) ?? null : null;
      return b`
            <div
              class="element-wrapper ${selected ? "selected" : ""}"
              style=${o({
        left: `${el.x}px`,
        top: `${el.y}px`,
        width: `${el.width}px`,
        height: `${el.height}px`,
        zIndex: selected ? "50" : "10"
      })}
              @pointerdown=${(e2) => this._onPointerDown(e2, el)}
            >
              <div class="element-inner">
                ${def ? def.render(el, entityState, this.hass) : b`<div
                      style="display:flex;align-items:center;justify-content:center;height:100%;color:#f55;font-size:12px;"
                    >
                      Unknown: ${el.type}
                    </div>`}
              </div>
              ${selected ? this._renderHandles(el) : A}
            </div>
          `;
    })}
      </div>
    `;
  }
  getElements() {
    return this.dashboard.elements;
  }
  addElement(el) {
    this.dashboard = {
      ...this.dashboard,
      elements: [...this.dashboard.elements, el]
    };
    this.selectedId = el.id;
    this.dispatchEvent(
      new CustomEvent("element-selected", { detail: el, bubbles: true })
    );
    this.requestUpdate();
  }
  updateSelectedElement(patch) {
    if (!this.selectedId) return;
    this._updateElement(this.selectedId, patch);
    const el = this.dashboard.elements.find((e2) => e2.id === this.selectedId);
    if (el) {
      this.dispatchEvent(
        new CustomEvent("element-selected", { detail: el, bubbles: true })
      );
    }
  }
  deleteElement(id) {
    this.dashboard = {
      ...this.dashboard,
      elements: this.dashboard.elements.filter((e2) => e2.id !== id)
    };
    if (this.selectedId === id) this.selectedId = null;
    this.requestUpdate();
  }
};
_VizlaceEditorCanvas.styles = i$5`
    :host {
      display: block;
      position: relative;
      flex: 1;
      overflow: auto;
      background: var(--card-background-color, #1c1c1e);
    }
    .canvas {
      position: relative;
      width: 1600px;
      min-height: 900px;
      background-image: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.07) 1px,
        transparent 1px
      );
      background-size: 10px 10px;
    }
    .element-wrapper {
      position: absolute;
      cursor: move;
      user-select: none;
    }
    .element-wrapper.selected {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 1px;
    }
    .element-inner {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: var(--ha-card-background, rgba(255, 255, 255, 0.05));
      border-radius: 6px;
      pointer-events: none;
    }
    .element-inner.interactive {
      pointer-events: auto;
    }
    .handle {
      position: absolute;
      width: 10px;
      height: 10px;
      background: var(--primary-color, #03a9f4);
      border: 2px solid #fff;
      border-radius: 50%;
      z-index: 100;
      cursor: var(--handle-cursor, nwse-resize);
    }
    .handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
    .handle.n  { top: -5px; left: calc(50% - 5px); cursor: n-resize; }
    .handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
    .handle.e  { top: calc(50% - 5px); right: -5px; cursor: e-resize; }
    .handle.se { bottom: -5px; right: -5px; cursor: se-resize; }
    .handle.s  { bottom: -5px; left: calc(50% - 5px); cursor: s-resize; }
    .handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
    .handle.w  { top: calc(50% - 5px); left: -5px; cursor: w-resize; }
  `;
let VizlaceEditorCanvas = _VizlaceEditorCanvas;
__decorateClass$4([
  n$1({ attribute: false })
], VizlaceEditorCanvas.prototype, "dashboard");
__decorateClass$4([
  n$1({ attribute: false })
], VizlaceEditorCanvas.prototype, "hass");
__decorateClass$4([
  r()
], VizlaceEditorCanvas.prototype, "selectedId");
customElements.define("vizlace-editor-canvas", VizlaceEditorCanvas);
const _VizlaceEditorToolbar = class _VizlaceEditorToolbar extends i$2 {
  render() {
    const elements = registry.getAll();
    return b`
      <div class="section-title">Elements</div>
      ${elements.map(
      (def) => b`
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
  _addElement(type) {
    this.dispatchEvent(
      new CustomEvent("add-element", {
        detail: { type },
        bubbles: true,
        composed: true
      })
    );
  }
};
_VizlaceEditorToolbar.styles = i$5`
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
let VizlaceEditorToolbar = _VizlaceEditorToolbar;
customElements.define("vizlace-editor-toolbar", VizlaceEditorToolbar);
var __defProp$3 = Object.defineProperty;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(target, key, result) || result;
  if (result) __defProp$3(target, key, result);
  return result;
};
const _VizlaceEditorInspector = class _VizlaceEditorInspector extends i$2 {
  constructor() {
    super(...arguments);
    this.element = null;
  }
  _patch(patch) {
    if (!this.element) return;
    this.dispatchEvent(
      new CustomEvent("element-change", {
        detail: { ...this.element, ...patch },
        bubbles: true,
        composed: true
      })
    );
  }
  _patchConfig(key, value) {
    if (!this.element) return;
    this._patch({ config: { ...this.element.config, [key]: value } });
  }
  render() {
    if (!this.element) {
      return b`<div class="empty">Select an element to configure it.</div>`;
    }
    const el = this.element;
    const def = registry.get(el.type);
    return b`
      <h3>${(def == null ? void 0 : def.label) ?? el.type}</h3>

      <!-- Position & size -->
      <label>Position & Size</label>
      <div class="pos-grid">
        <div class="field-group">
          <label>X</label>
          <input
            type="number"
            .value=${String(el.x)}
            @change=${(e2) => this._patch({ x: Number(e2.target.value) })}
          />
        </div>
        <div class="field-group">
          <label>Y</label>
          <input
            type="number"
            .value=${String(el.y)}
            @change=${(e2) => this._patch({ y: Number(e2.target.value) })}
          />
        </div>
        <div class="field-group">
          <label>Width</label>
          <input
            type="number"
            .value=${String(el.width)}
            @change=${(e2) => this._patch({
      width: Number(e2.target.value)
    })}
          />
        </div>
        <div class="field-group">
          <label>Height</label>
          <input
            type="number"
            .value=${String(el.height)}
            @change=${(e2) => this._patch({
      height: Number(e2.target.value)
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
          @change=${(e2) => this._patch({
      entity_id: e2.target.value.trim() || void 0
    })}
        />
      </div>

      ${def ? b`
            <hr class="separator" />
            ${def.configFields.map((field) => {
      const val = el.config[field.key] ?? field.default ?? "";
      if (field.type === "select" && field.options) {
        return b`
                  <div class="field-group">
                    <label>${field.label}</label>
                    <select
                      .value=${String(val)}
                      @change=${(e2) => this._patchConfig(
          field.key,
          e2.target.value
        )}
                    >
                      ${field.options.map(
          (o2) => b`
                          <option
                            value=${o2.value}
                            ?selected=${o2.value === String(val)}
                          >
                            ${o2.label}
                          </option>
                        `
        )}
                    </select>
                  </div>
                `;
      }
      if (field.type === "boolean") {
        return b`
                  <div class="field-group">
                    <label>
                      <input
                        type="checkbox"
                        ?checked=${Boolean(val)}
                        @change=${(e2) => this._patchConfig(
          field.key,
          e2.target.checked
        )}
                      />
                      ${field.label}
                    </label>
                  </div>
                `;
      }
      return b`
                <div class="field-group">
                  <label>${field.label}</label>
                  <input
                    type=${field.type === "color" ? "color" : field.type === "number" ? "number" : "text"}
                    .value=${String(val)}
                    @change=${(e2) => {
        const raw = e2.target.value;
        this._patchConfig(
          field.key,
          field.type === "number" ? Number(raw) : raw
        );
      }}
                  />
                </div>
              `;
    })}
          ` : A}

      <button
        class="btn-delete"
        @click=${() => this.dispatchEvent(
      new CustomEvent("element-delete", {
        detail: el.id,
        bubbles: true,
        composed: true
      })
    )}
      >
        Delete element
      </button>
    `;
  }
};
_VizlaceEditorInspector.styles = i$5`
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
let VizlaceEditorInspector = _VizlaceEditorInspector;
__decorateClass$3([
  n$1({ attribute: false })
], VizlaceEditorInspector.prototype, "element");
customElements.define("vizlace-editor-inspector", VizlaceEditorInspector);
var __defProp$2 = Object.defineProperty;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(target, key, result) || result;
  if (result) __defProp$2(target, key, result);
  return result;
};
const _VizlaceEditor = class _VizlaceEditor extends i$2 {
  constructor() {
    super(...arguments);
    this.saving = false;
    this.saveStatus = "";
    this.selectedElement = null;
  }
  async _save() {
    this.saving = true;
    this.saveStatus = "";
    try {
      const dashboard = {
        ...this.dashboard,
        elements: this.canvasEl.getElements()
      };
      const result = await wsDashboardSave(this.hass, dashboard);
      this.dashboard = result.dashboard;
      this.saveStatus = "Saved!";
      setTimeout(() => this.saveStatus = "", 2e3);
    } catch (e2) {
      this.saveStatus = "Error saving";
    } finally {
      this.saving = false;
    }
  }
  _syncElements() {
    this.dashboard = {
      ...this.dashboard,
      elements: this.canvasEl.getElements()
    };
  }
  _onAddElement(e2) {
    const def = registry.get(e2.detail.type);
    if (!def) return;
    const id = `el_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newEl = {
      id,
      type: e2.detail.type,
      x: 80,
      y: 80,
      width: def.defaultSize.width,
      height: def.defaultSize.height,
      config: { ...def.defaultConfig }
    };
    this.canvasEl.addElement(newEl);
    this._syncElements();
  }
  _onElementSelected(e2) {
    this.selectedElement = e2.detail;
  }
  _onElementChange(e2) {
    this.canvasEl.updateSelectedElement(e2.detail);
    this.selectedElement = e2.detail;
    this._syncElements();
  }
  _onElementDelete(e2) {
    this.canvasEl.deleteElement(e2.detail);
    this.selectedElement = null;
    this._syncElements();
  }
  _onElementMoved() {
    this._syncElements();
  }
  _onElementResized() {
    this._syncElements();
  }
  _onTitleChange(e2) {
    this.dashboard = {
      ...this.dashboard,
      title: e2.target.value
    };
  }
  render() {
    var _a2;
    return b`
      <div class="topbar">
        <button
          class="btn btn-back"
          @click=${() => this.dispatchEvent(
      new CustomEvent("navigate-back", { bubbles: true, composed: true })
    )}
        >
          ← Back
        </button>
        <input
          type="text"
          placeholder="Dashboard title"
          .value=${((_a2 = this.dashboard) == null ? void 0 : _a2.title) ?? ""}
          @input=${this._onTitleChange}
        />
        <button
          class="btn btn-save"
          ?disabled=${this.saving}
          @click=${this._save}
        >
          ${this.saving ? "Saving…" : "Save"}
        </button>
        ${this.saveStatus ? b`<span class="status">${this.saveStatus}</span>` : A}
      </div>

      <div
        class="main"
        @add-element=${this._onAddElement}
        @element-selected=${this._onElementSelected}
        @element-change=${this._onElementChange}
        @element-delete=${this._onElementDelete}
        @element-moved=${this._onElementMoved}
        @element-resized=${this._onElementResized}
      >
        <vizlace-editor-toolbar></vizlace-editor-toolbar>
        <vizlace-editor-canvas
          .dashboard=${this.dashboard}
          .hass=${this.hass}
        ></vizlace-editor-canvas>
        <vizlace-editor-inspector
          .element=${this.selectedElement}
        ></vizlace-editor-inspector>
      </div>
    `;
  }
};
_VizlaceEditor.styles = i$5`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .topbar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      background: var(--app-header-background-color, #1a1a2e);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }
    .topbar input[type="text"] {
      flex: 1;
      max-width: 300px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      color: var(--primary-text-color, #fff);
      padding: 6px 10px;
      font-size: 14px;
    }
    .btn {
      padding: 7px 16px;
      border-radius: 5px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-save {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .btn-save:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .btn-back {
      background: rgba(255, 255, 255, 0.1);
      color: var(--primary-text-color, #fff);
    }
    .status {
      font-size: 12px;
      color: var(--secondary-text-color, #aaa);
    }
    .main {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    vizlace-editor-canvas {
      flex: 1;
    }
  `;
let VizlaceEditor = _VizlaceEditor;
__decorateClass$2([
  n$1({ attribute: false })
], VizlaceEditor.prototype, "hass");
__decorateClass$2([
  n$1({ attribute: false })
], VizlaceEditor.prototype, "dashboard");
__decorateClass$2([
  r()
], VizlaceEditor.prototype, "saving");
__decorateClass$2([
  r()
], VizlaceEditor.prototype, "saveStatus");
__decorateClass$2([
  r()
], VizlaceEditor.prototype, "selectedElement");
__decorateClass$2([
  e$1("vizlace-editor-canvas")
], VizlaceEditor.prototype, "canvasEl");
customElements.define("vizlace-editor", VizlaceEditor);
var __defProp$1 = Object.defineProperty;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(target, key, result) || result;
  if (result) __defProp$1(target, key, result);
  return result;
};
const _VizlaceViewerCanvas = class _VizlaceViewerCanvas extends i$2 {
  render() {
    if (!this.dashboard) return A;
    const bg = this.dashboard.background;
    return b`
      <div
        class="canvas"
        style=${bg ? `background:${bg};` : ""}
      >
        ${this.dashboard.elements.map((el) => {
      var _a2;
      const def = registry.get(el.type);
      const entityState = el.entity_id ? ((_a2 = this.hass) == null ? void 0 : _a2.states[el.entity_id]) ?? null : null;
      return b`
            <div
              class="element-wrapper"
              style=${o({
        left: `${el.x}px`,
        top: `${el.y}px`,
        width: `${el.width}px`,
        height: `${el.height}px`
      })}
            >
              ${def ? def.render(el, entityState, this.hass) : b`<div
                    style="display:flex;align-items:center;justify-content:center;height:100%;color:#f55;font-size:12px;"
                  >
                    Unknown: ${el.type}
                  </div>`}
            </div>
          `;
    })}
      </div>
    `;
  }
};
_VizlaceViewerCanvas.styles = i$5`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .canvas {
      position: relative;
      width: 1600px;
      min-height: 900px;
    }
    .element-wrapper {
      position: absolute;
      overflow: hidden;
      border-radius: 6px;
      background: var(--ha-card-background, rgba(255, 255, 255, 0.05));
    }
  `;
let VizlaceViewerCanvas = _VizlaceViewerCanvas;
__decorateClass$1([
  n$1({ attribute: false })
], VizlaceViewerCanvas.prototype, "dashboard");
__decorateClass$1([
  n$1({ attribute: false })
], VizlaceViewerCanvas.prototype, "hass");
customElements.define("vizlace-viewer-canvas", VizlaceViewerCanvas);
var __defProp = Object.defineProperty;
var __decorateClass = (decorators, target, key, kind) => {
  var result = void 0;
  for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
    if (decorator = decorators[i4])
      result = decorator(target, key, result) || result;
  if (result) __defProp(target, key, result);
  return result;
};
const _VizlacePanel = class _VizlacePanel extends i$2 {
  constructor() {
    super(...arguments);
    this.panel = null;
    this.view = { mode: "list" };
    this.dashboards = [];
    this.activeDashboard = null;
    this.loading = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this._loadList();
  }
  async _loadList() {
    this.loading = true;
    try {
      const res = await wsDashboardsList(this.hass);
      this.dashboards = res.dashboards ?? [];
    } finally {
      this.loading = false;
    }
  }
  async _openView(id) {
    this.loading = true;
    try {
      const res = await wsDashboardGet(this.hass, id);
      this.activeDashboard = res.dashboard;
      this.view = { mode: "view", dashboardId: id };
    } finally {
      this.loading = false;
    }
  }
  async _openEdit(id) {
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
        elements: []
      };
    }
    this.view = { mode: "edit", dashboardId: id };
  }
  async _delete(id) {
    if (!confirm("Delete this dashboard?")) return;
    await wsDashboardDelete(this.hass, id);
    this.dashboards = this.dashboards.filter((d2) => d2.id !== id);
  }
  _backToList() {
    this.view = { mode: "list" };
    this._loadList();
  }
  _renderList() {
    return b`
      <div class="list-header">
        <h1>Vizlace Dashboards</h1>
        <button class="btn-new" @click=${() => this._openEdit(null)}>
          + New Dashboard
        </button>
      </div>

      ${this.loading ? b`<div class="loading">Loading…</div>` : this.dashboards.length === 0 ? b`
            <div class="empty-state">
              <p>No dashboards yet.</p>
              <button class="btn-new" @click=${() => this._openEdit(null)}>
                Create your first dashboard
              </button>
            </div>
          ` : b`
            <div class="dashboard-list">
              ${this.dashboards.map(
      (d2) => b`
                  <div class="dashboard-card" @click=${() => this._openView(d2.id)}>
                    <div class="card-title">${d2.title || "Unnamed"}</div>
                    <div
                      style="font-size:12px;color:var(--secondary-text-color,#aaa);"
                    >
                      ID: ${d2.id.slice(0, 8)}…
                    </div>
                    <div class="card-actions">
                      <button
                        class="card-btn"
                        @click=${(e2) => {
        e2.stopPropagation();
        this._openEdit(d2.id);
      }}
                      >
                        Edit
                      </button>
                      <button
                        class="card-btn danger"
                        @click=${(e2) => {
        e2.stopPropagation();
        this._delete(d2.id);
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
  _renderViewer() {
    if (!this.activeDashboard) return A;
    const db = this.activeDashboard;
    return b`
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
  _renderEditor() {
    if (!this.activeDashboard) return A;
    return b`
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
    return A;
  }
};
_VizlacePanel.styles = i$5`
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
let VizlacePanel = _VizlacePanel;
__decorateClass([
  n$1({ attribute: false })
], VizlacePanel.prototype, "hass");
__decorateClass([
  n$1({ attribute: false })
], VizlacePanel.prototype, "panel");
__decorateClass([
  r()
], VizlacePanel.prototype, "view");
__decorateClass([
  r()
], VizlacePanel.prototype, "dashboards");
__decorateClass([
  r()
], VizlacePanel.prototype, "activeDashboard");
__decorateClass([
  r()
], VizlacePanel.prototype, "loading");
customElements.define("vizlace-panel", VizlacePanel);
function polarToCartesian(cx, cy, r2, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return [cx + r2 * Math.cos(rad), cy + r2 * Math.sin(rad)];
}
function arcPath(cx, cy, r2, startDeg, endDeg) {
  const [sx, sy] = polarToCartesian(cx, cy, r2, startDeg);
  const [ex, ey] = polarToCartesian(cx, cy, r2, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r2} ${r2} 0 ${large} 1 ${ex} ${ey}`;
}
const gaugeDef = {
  type: "gauge",
  label: "Gauge",
  icon: "mdi:gauge",
  defaultSize: { width: 160, height: 160 },
  defaultConfig: {
    min: 0,
    max: 100,
    unit: "",
    label: "",
    color: "#4caf50"
  },
  configFields: [
    { key: "label", label: "Label", type: "text", default: "" },
    { key: "min", label: "Min", type: "number", default: 0 },
    { key: "max", label: "Max", type: "number", default: 100 },
    { key: "unit", label: "Unit", type: "text", default: "" },
    { key: "color", label: "Color", type: "color", default: "#4caf50" }
  ],
  render(config, state, _hass) {
    const cfg = config.config;
    const min = Number(cfg.min ?? 0);
    const max = Number(cfg.max ?? 100);
    const unit = String(cfg.unit ?? "");
    const label = String(cfg.label ?? "");
    const color = String(cfg.color ?? "#4caf50");
    const raw = state ? parseFloat(state.state) : NaN;
    const value = isNaN(raw) ? 0 : raw;
    const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
    const START = -135;
    const RANGE = 270;
    const endDeg = START + pct * RANGE;
    const cx = 80;
    const cy = 80;
    const r2 = 60;
    const trackPath = arcPath(cx, cy, r2, START, START + RANGE);
    const fillPath = pct > 0 ? arcPath(cx, cy, r2, START, endDeg) : "";
    return b`
      <div
        style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;"
      >
        ${w`
          <svg viewBox="0 0 160 160" width="100%" height="100%" style="overflow:visible">
            <path d="${trackPath}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="12" stroke-linecap="round"/>
            ${fillPath ? w`<path d="${fillPath}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/>` : ""}
            <text x="80" y="82" text-anchor="middle" dominant-baseline="middle"
              font-size="22" font-weight="bold" fill="var(--primary-text-color,#fff)">
              ${state ? state.state : "—"}${unit}
            </text>
            ${label ? w`<text x="80" y="106" text-anchor="middle" font-size="11" fill="var(--secondary-text-color,#aaa)">${label}</text>` : ""}
          </svg>
        `}
      </div>
    `;
  }
};
registry.register(gaugeDef);
const textDisplayDef = {
  type: "text-display",
  label: "Text Display",
  icon: "mdi:text",
  defaultSize: { width: 160, height: 80 },
  defaultConfig: {
    label: "",
    fontSize: 28,
    color: "#ffffff",
    unit: "",
    prefix: ""
  },
  configFields: [
    { key: "label", label: "Label", type: "text", default: "" },
    { key: "prefix", label: "Prefix", type: "text", default: "" },
    { key: "unit", label: "Unit", type: "text", default: "" },
    { key: "fontSize", label: "Font size (px)", type: "number", default: 28 },
    { key: "color", label: "Color", type: "color", default: "#ffffff" }
  ],
  render(config, state, _hass) {
    const cfg = config.config;
    const label = String(cfg.label ?? "");
    const fontSize = Number(cfg.fontSize ?? 28);
    const color = String(cfg.color ?? "#ffffff");
    const unit = String(cfg.unit ?? "");
    const prefix = String(cfg.prefix ?? "");
    const displayValue = state ? `${prefix}${state.state}${unit}` : "—";
    return b`
      <div
        style="
          width:100%;height:100%;
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          box-sizing:border-box;padding:4px;
        "
      >
        <div
          style="
            font-size:${fontSize}px;
            font-weight:bold;
            color:${color};
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          "
        >
          ${displayValue}
        </div>
        ${label ? b`<div
              style="font-size:11px;color:var(--secondary-text-color,#aaa);margin-top:2px;"
            >
              ${label}
            </div>` : ""}
      </div>
    `;
  }
};
registry.register(textDisplayDef);
const buttonDef = {
  type: "button",
  label: "Button",
  icon: "mdi:gesture-tap-button",
  defaultSize: { width: 140, height: 60 },
  defaultConfig: {
    label: "Press",
    service_domain: "homeassistant",
    service_name: "toggle",
    service_data: "{}",
    color: "#2196f3"
  },
  configFields: [
    { key: "label", label: "Button Label", type: "text", default: "Press" },
    {
      key: "service_domain",
      label: "Service Domain",
      type: "text",
      default: "homeassistant"
    },
    {
      key: "service_name",
      label: "Service Name",
      type: "text",
      default: "toggle"
    },
    {
      key: "service_data",
      label: "Service Data (JSON)",
      type: "text",
      default: "{}"
    },
    { key: "color", label: "Color", type: "color", default: "#2196f3" }
  ],
  render(config, _state, hass) {
    const cfg = config.config;
    const label = String(cfg.label ?? "Press");
    const domain = String(cfg.service_domain ?? "homeassistant");
    const service = String(cfg.service_name ?? "toggle");
    const color = String(cfg.color ?? "#2196f3");
    let serviceData = {};
    try {
      serviceData = JSON.parse(String(cfg.service_data ?? "{}"));
    } catch {
    }
    if (config.entity_id && !serviceData.entity_id) {
      serviceData = { entity_id: config.entity_id, ...serviceData };
    }
    const handleClick = (e2) => {
      e2.stopPropagation();
      hass.callService(domain, service, serviceData);
    };
    return b`
      <div
        style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"
      >
        <button
          @click=${handleClick}
          style="
            background:${color};
            color:#fff;
            border:none;
            border-radius:6px;
            padding:8px 20px;
            font-size:15px;
            font-weight:bold;
            cursor:pointer;
            width:90%;
            height:80%;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            transition:filter 0.1s;
          "
          @mousedown=${(e2) => e2.currentTarget.style.filter = "brightness(0.85)"}
          @mouseup=${(e2) => e2.currentTarget.style.filter = ""}
          @mouseleave=${(e2) => e2.currentTarget.style.filter = ""}
        >
          ${label}
        </button>
      </div>
    `;
  }
};
registry.register(buttonDef);
const colorFieldDef = {
  type: "color-field",
  label: "Color Field",
  icon: "mdi:palette",
  defaultSize: { width: 120, height: 120 },
  defaultConfig: {
    mode: "bw",
    on_color: "#ffffff",
    off_color: "#000000",
    label: ""
  },
  configFields: [
    {
      key: "mode",
      label: "Mode",
      type: "select",
      options: [
        { value: "bw", label: "On/Off (black & white)" },
        { value: "color", label: "Color from state" }
      ],
      default: "bw"
    },
    {
      key: "on_color",
      label: "On Color",
      type: "color",
      default: "#ffffff"
    },
    {
      key: "off_color",
      label: "Off Color",
      type: "color",
      default: "#000000"
    },
    { key: "label", label: "Label", type: "text", default: "" }
  ],
  render(config, state, _hass) {
    const cfg = config.config;
    const mode = String(cfg.mode ?? "bw");
    const onColor = String(cfg.on_color ?? "#ffffff");
    const offColor = String(cfg.off_color ?? "#000000");
    const label = String(cfg.label ?? "");
    let bgColor = offColor;
    if (state) {
      if (mode === "color") {
        bgColor = state.state;
      } else {
        bgColor = state.state === "on" || state.state === "true" ? onColor : offColor;
      }
    }
    return b`
      <div
        style="
          width:100%;height:100%;
          background:${bgColor};
          display:flex;
          align-items:flex-end;
          justify-content:center;
          padding:4px;
          box-sizing:border-box;
          border-radius:4px;
          transition:background 0.3s;
        "
      >
        ${label ? b`<span
              style="
                font-size:11px;
                color:${bgColor === "#ffffff" || bgColor === "#fff" ? "#000" : "#fff"};
                background:rgba(0,0,0,0.3);
                border-radius:3px;
                padding:1px 4px;
              "
              >${label}</span
            >` : ""}
      </div>
    `;
  }
};
registry.register(colorFieldDef);
const heatingDef = {
  type: "heating",
  label: "Heating",
  icon: "mdi:thermometer",
  defaultSize: { width: 160, height: 180 },
  defaultConfig: {
    label: "Thermostat",
    min_temp: 5,
    max_temp: 35,
    step: 0.5
  },
  configFields: [
    { key: "label", label: "Label", type: "text", default: "Thermostat" },
    { key: "min_temp", label: "Min Temp (°C)", type: "number", default: 5 },
    { key: "max_temp", label: "Max Temp (°C)", type: "number", default: 35 },
    { key: "step", label: "Step", type: "number", default: 0.5 }
  ],
  render(config, state, hass) {
    const cfg = config.config;
    const label = String(cfg.label ?? "Thermostat");
    const minTemp = Number(cfg.min_temp ?? 5);
    const maxTemp = Number(cfg.max_temp ?? 35);
    const step = Number(cfg.step ?? 0.5);
    const currentTemp = state ? state.attributes["current_temperature"] ?? null : null;
    const setPoint = state ? state.attributes["temperature"] ?? null : null;
    const adjust = (delta) => (e2) => {
      e2.stopPropagation();
      if (!config.entity_id || setPoint === null) return;
      const newTemp = Math.min(
        maxTemp,
        Math.max(minTemp, setPoint + delta)
      );
      hass.callService("climate", "set_temperature", {
        entity_id: config.entity_id,
        temperature: newTemp
      });
    };
    return b`
      <div
        style="
          width:100%;height:100%;
          display:flex;flex-direction:column;
          align-items:center;justify-content:space-between;
          padding:8px;box-sizing:border-box;
          color:var(--primary-text-color,#fff);
        "
      >
        <div style="font-size:12px;color:var(--secondary-text-color,#aaa);">
          ${label}
        </div>

        <div
          style="font-size:13px;color:var(--secondary-text-color,#aaa);"
        >
          Current:
          <span style="font-weight:bold;color:var(--primary-text-color,#fff);">
            ${currentTemp !== null ? `${currentTemp}°C` : "—"}
          </span>
        </div>

        <div
          style="display:flex;align-items:center;gap:12px;"
        >
          <button
            @click=${adjust(-step)}
            style="
              width:36px;height:36px;border-radius:50%;
              border:none;background:rgba(255,255,255,0.12);
              color:var(--primary-text-color,#fff);
              font-size:22px;cursor:pointer;
              display:flex;align-items:center;justify-content:center;
            "
          >−</button>

          <div style="text-align:center;">
            <div
              style="font-size:28px;font-weight:bold;line-height:1;"
            >
              ${setPoint !== null ? `${setPoint}°C` : "—"}
            </div>
            <div
              style="font-size:10px;color:var(--secondary-text-color,#aaa);margin-top:2px;"
            >
              Set point
            </div>
          </div>

          <button
            @click=${adjust(step)}
            style="
              width:36px;height:36px;border-radius:50%;
              border:none;background:rgba(255,255,255,0.12);
              color:var(--primary-text-color,#fff);
              font-size:22px;cursor:pointer;
              display:flex;align-items:center;justify-content:center;
            "
          >+</button>
        </div>

        <div
          style="
            font-size:11px;color:var(--secondary-text-color,#aaa);
            padding:4px 8px;
            background:rgba(255,255,255,0.05);
            border-radius:4px;
          "
        >
          ${(state == null ? void 0 : state.state) ?? "unavailable"}
        </div>
      </div>
    `;
  }
};
registry.register(heatingDef);
