import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { CalendarioMttoList } from './calendario-mtto-list';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

describe('CalendarioMttoList', () => {
  let component: CalendarioMttoList;
  let fixture: ComponentFixture<CalendarioMttoList>;

  beforeEach(() => {
    TestBed.overrideComponent(CalendarioMttoList, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [CalendarioMttoList],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CalendarioMttoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default tipoCalendario as "preventivo de equipos"', () => {
    expect(component.tipoCalendario()).toBe('preventivo de equipos');
  });

  it('should have default activeTabValue as "tab1"', () => {
    expect(component.activeTabValue()).toBe('tab1');
  });

  it('message should update tipoCalendario', () => {
    component.message('nuevo tipo');
    expect(component.tipoCalendario()).toBe('nuevo tipo');
  });
});
