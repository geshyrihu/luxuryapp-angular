
import { getTestBed } from '@angular/core/testing';
import '@angular/localize/init';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { vi } from 'vitest';

// Compatibility shim: alias 'jest' → 'vi' for existing specs
(globalThis as any).jest = vi;

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);











