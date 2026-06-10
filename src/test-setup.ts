
import { getTestBed } from '@angular/core/testing';
import '@angular/localize/init';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { vi } from 'vitest';

// ResizeObserver polyfill for chart.js compatibility in jsdom
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as any).ResizeObserver = ResizeObserverMock;
}

// Stencil/ionicons require adoptedStyleSheets on document
if (typeof document !== 'undefined' && !('adoptedStyleSheets' in document)) {
  Object.defineProperty(document, 'adoptedStyleSheets', {
    value: [],
    writable: true,
    configurable: true,
  });
}

// Compatibility shim: alias 'jest' → 'vi' for existing specs
(globalThis as any).jest = vi;

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
    methods.forEach((m) => { obj[m] = vi.fn(); });
    return obj;
  },
  any: (type: any) => type,
  anything: () => expect.anything(),
  objectContaining: (obj: any) => expect.objectContaining(obj),
  stringMatching: (pattern: RegExp | string) => expect.stringMatching(pattern),
};

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);











