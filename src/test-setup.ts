// @ts-nocheck

import { getTestBed } from '@angular/core/testing';
import '@angular/localize/init';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

// ResizeObserver polyfill for canvas chart compatibility in jsdom
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as any).ResizeObserver = ResizeObserverMock;
}

// Stencil/ionicons require adoptedStyleSheets on document and HTMLElements
if (typeof document !== 'undefined' && !('adoptedStyleSheets' in document)) {
  Object.defineProperty(document, 'adoptedStyleSheets', {
    value: [],
    writable: true,
    configurable: true,
  });
}
if (typeof HTMLElement !== 'undefined' && !('adoptedStyleSheets' in HTMLElement.prototype)) {
  Object.defineProperty(HTMLElement.prototype, 'adoptedStyleSheets', {
    get() { return []; },
    set() { /* no-op */ },
    configurable: true,
  });
}
if (typeof ShadowRoot !== 'undefined' && !('adoptedStyleSheets' in ShadowRoot.prototype)) {
  Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
    get() { return []; },
    set() { /* no-op */ },
    configurable: true,
  });
}

// CSSStyleSheet.replaceSync override para @stencil/core en jsdom.
// Stencil llama a replaceSync(cssText) con cssText que puede ser
// undefined en el entorno de test, causando errores en @acemir/cssom.
if (typeof CSSStyleSheet !== 'undefined') {
  const origReplaceSync = CSSStyleSheet.prototype.replaceSync;
  CSSStyleSheet.prototype.replaceSync = function (cssText: string): void {
    if (typeof cssText !== 'string') return;
    if (origReplaceSync) {
      try { origReplaceSync.call(this, cssText); } catch { /* ignore */ }
    }
  };
}

// ng2-pdf-viewer: en su inicializacion de modulo intenta asignar
// 'verbosity' a PDFJS (objeto no-extensible en test). Mockeamos
// el modulo completo para evitar el side-effect al cargarse.
vi.mock('ng2-pdf-viewer', () => ({
  PdfViewerModule: { ngModule: class {} } as any,
}));

if (typeof globalThis.Worker === 'undefined') {
  (globalThis as any).Worker = class WorkerMock {
    url: string;
    onmessage: ((this: Worker, ev: MessageEvent) => any) | null = null;
    constructor(url: string | URL) { this.url = url.toString(); }
    postMessage(msg: any) { /* no-op */ }
    terminate() { /* no-op */ }
    addEventListener() { /* no-op */ }
    removeEventListener() { /* no-op */ }
    dispatchEvent() { return false; }
    onerror: any = null;
  };
}

// window.matchMedia polyfill for chart components in jsdom
if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
  const matchMediaMock = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
  (window as any).matchMedia = matchMediaMock;
  (globalThis as any).matchMedia = matchMediaMock;
}

// IntersectionObserver polyfill for infinite-scroll components in jsdom
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
    root = null;
    rootMargin = '0px';
    thresholds = [0];
  }
  (globalThis as any).IntersectionObserver = IntersectionObserverMock;
}

// Compatibility shim: alias 'jest' → 'vi' for existing specs
(globalThis as any).jest = vi;

// Compatibility shim: jasmine global spyOn → vi.spyOn with .and API
const attachAnd = (fn: any) => {
  if (!fn.and) {
    fn.and = {
      returnValue: (v: any) => { fn.mockReturnValue(v); return fn; },
      callFake: (f: any) => { fn.mockImplementation(f); return fn; },
      resolveTo: (v: any) => { fn.mockResolvedValue(v); return fn; },
      rejectWith: (v: any) => { fn.mockRejectedValue(v); return fn; },
      throwError: (e: any) => { fn.mockImplementation(() => { throw e; }); return fn; },
      callThrough: () => fn,
    };
  }
  return fn;
};
(globalThis as any).spyOn = (obj: any, method: string) =>
  attachAnd(vi.spyOn(obj, method as never));

// navigator.geolocation stub (jsdom lacks it)
if (typeof navigator !== 'undefined' && typeof (navigator as any).geolocation === 'undefined') {
  Object.defineProperty(navigator, 'geolocation', {
    value: {
      getCurrentPosition: () => {},
      watchPosition: () => 0,
      clearWatch: () => {},
    },
    configurable: true,
  });
}

// Compatibility shim: jasmine.createSpy → vi.fn() for existing specs
(globalThis as any).jasmine = {
  createSpy(name?: string) {
    const fn: any = vi.fn();
    fn.and = {
      returnValue: (v: any) => { fn.mockReturnValue(v); return fn; },
      callFake: (f: any) => { fn.mockImplementation(f); return fn; },
      returnThis: () => { fn.mockImplementation(function (this: any) { return this; }); return fn; },
      callThrough: () => fn,
      resolveTo: (v: any) => { fn.mockResolvedValue(v); return fn; },
      rejectWith: (v: any) => { fn.mockRejectedValue(v); return fn; },
      throwError: (e: any) => { fn.mockImplementation(() => { throw e; }); return fn; },
    };
    fn.calls = {
      any: () => fn.mock.calls.length > 0,
      count: () => fn.mock.calls.length,
      argsFor: (i: number) => fn.mock.calls[i],
      allArgs: () => fn.mock.calls,
      first: () => fn.mock.calls[0],
      mostRecent: () => fn.mock.calls[fn.mock.calls.length - 1],
    };
    return fn;
  },
  createSpyObj(name: string, methods: string[]) {
    const obj: any = {};
    methods.forEach((m) => { obj[m] = (this as any).createSpy(`${name}.${m}`); });
    return obj;
  },
  any: (type: any) => expect.any(type),
  anything: () => expect.anything(),
  objectContaining: (obj: any) => expect.objectContaining(obj),
  stringMatching: (pattern: RegExp | string) => expect.stringMatching(pattern),
};

// Mock compartido para HttpClientWithoutInterceptors.
// Retorna un Observable real con estructura ApiResponseDTO exitosa
// para que AuthService.initSilentLogin() pueda completar el flujo.
// Se usa en ~75 spec files de features/configuration/ y vault/.
(globalThis as any).__mockHttpClient = (() => {
  const mockResponse = { success: true, data: { infoUserAuthDTO: { applicationUserId: '00000000-0000-0000-0000-000000000000' }, roles: [] }, message: '', errors: [] };
  const obs = of(mockResponse);
  return {
    get: vi.fn(() => obs),
    post: vi.fn(() => obs),
    put: vi.fn(() => obs),
    delete: vi.fn(() => obs),
  };
})();

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);











