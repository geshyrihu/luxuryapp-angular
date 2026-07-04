import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RangoCalendarioyyyymmdd } from './rango-calendario-yyyymmdd';
import { DateService } from '../../services/date.service';
import { FiltroCalendarService } from '../../services/filtro-calendar.service';
import { vi } from 'vitest';

const dateServiceMock = {
  getDateFormat: vi.fn((date) => '2024-06-01'),
};

const filtroCalendarMock = {
  setFechas: vi.fn(),
  fechas$: { emit: vi.fn() },
};

describe('RangoCalendarioyyyymmdd', () => {
  let component: RangoCalendarioyyyymmdd;
  let fixture: ComponentFixture<RangoCalendarioyyyymmdd>;

  beforeEach(() => {
    filtroCalendarMock.setFechas = vi.fn();
    filtroCalendarMock.fechas$ = { emit: vi.fn() };
  });

  beforeEach(async () => {
    TestBed.overrideComponent(RangoCalendarioyyyymmdd, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    await TestBed.configureTestingModule({
      imports: [RangoCalendarioyyyymmdd],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DateService, useValue: dateServiceMock },
        { provide: FiltroCalendarService, useValue: filtroCalendarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RangoCalendarioyyyymmdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default mostrarLabelDesde as true', () => {
    expect(component.mostrarLabelDesde()).toBe(true);
  });

  it('should have default mostrarLabelHasta as true', () => {
    expect(component.mostrarLabelHasta()).toBe(true);
  });

  it('should have Spanish locale', () => {
    expect(component.localeSpanish).toBeDefined();
  });

  it('should call setFechas on onSendDateRange', () => {
    component.onSendDateRange('2024-06-01', '2024-06-30');
    expect(filtroCalendarMock.setFechas).toHaveBeenCalledWith('2024-06-01', '2024-06-30');
  });

  it('should emit fechas$ on onSendDateRange with valid dates', () => {
    component.onSendDateRange('2024-06-01', '2024-06-30');
    expect(filtroCalendarMock.fechas$.emit).toHaveBeenCalledWith({
      fechaInicio: '2024-06-01',
      fechaFinal: '2024-06-01',
    });
  });

  it('should not emit fechas$ when dates are null', () => {
    component.onSendDateRange(null, null);
    expect(filtroCalendarMock.fechas$.emit).not.toHaveBeenCalled();
  });
});
