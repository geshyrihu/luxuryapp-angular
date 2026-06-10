import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import { ResultadoGeneralService } from 'src/app/core/services/resultado-general.service';
import { ResultadoGeneralGrafico } from './resultado-general-grafico';

describe('ResultadoGeneralGrafico', () => {
  let component: ResultadoGeneralGrafico;
  let fixture: ComponentFixture<ResultadoGeneralGrafico>;
  let mockResultadoGeneralS: any;
  let mockRangoCalendarioS: any;

  const mockData = [
    {
      concepto: { label: 'Minuta' },
      solicitudesPendientes: 5,
      solicitudesAtendidas: 15,
    },
    {
      concepto: { label: 'Mttos Preventivos' },
      solicitudesPendientes: 3,
      solicitudesAtendidas: 12,
    },
    {
      concepto: { label: 'Mttos Correctivos' },
      solicitudesPendientes: 2,
      solicitudesAtendidas: 8,
    },
    {
      concepto: { label: 'Minuta-Contable' },
      solicitudesPendientes: 1,
      solicitudesAtendidas: 9,
    },
    {
      concepto: { label: 'Minuta-Operaciones' },
      solicitudesPendientes: 4,
      solicitudesAtendidas: 6,
    },
    {
      concepto: { label: 'Minuta-Legal' },
      solicitudesPendientes: 2,
      solicitudesAtendidas: 18,
    },
  ];

  beforeEach(() => {
    mockResultadoGeneralS = {
      dataGrafico: mockData,
    };
    mockRangoCalendarioS = {
      fechaFinal: new Date(2025, 0, 31),
    };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(ResultadoGeneralGrafico, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ResultadoGeneralGrafico],
      providers: [
        { provide: ResultadoGeneralService, useValue: mockResultadoGeneralS },
        { provide: FiltroCalendarService, useValue: mockRangoCalendarioS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ResultadoGeneralGrafico);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call onSetDataGraficos', () => {
    component.ngOnInit();
    expect(component.graficoMinutas.length).toBeGreaterThan(0);
    expect(component.graficoMttoPreventivos.length).toBeGreaterThan(0);
    expect(component.graficosMantenimiento.length).toBeGreaterThan(0);
    expect(component.graficoMinutasContable.length).toBeGreaterThan(0);
    expect(component.graficoMinutasOperaciones.length).toBeGreaterThan(0);
    expect(component.graficoMinutasLegal.length).toBeGreaterThan(0);
  });

  it('onSetDataGraficos should categorize data correctly', () => {
    component.onSetDataGraficos(mockData);

    expect(component.totalMinutas).toBeGreaterThan(0);
    expect(component.totalMttoPreventivos).toBeGreaterThan(0);
    expect(component.totalsMantenimiento).toBeGreaterThan(0);
    expect(component.totalMinutasContable).toBeGreaterThan(0);
    expect(component.totalMinutasOperaciones).toBeGreaterThan(0);
    expect(component.totalMinutasLegal).toBeGreaterThan(0);
  });

  it('onEvaluation should calculate percentage correctly', () => {
    expect(component.onEvaluation(5, 15)).toBe(75);
    expect(component.onEvaluation(0, 10)).toBe(100);
    expect(component.onEvaluation(10, 0)).toBe(0);
  });

  it('onLoadTitle should return correct evaluation text', () => {
    expect(component.onLoadTitle(94)).toBe('RIESGO');
    expect(component.onLoadTitle(100)).toBe('EXCELENTE');
    expect(component.onLoadTitle(95)).toBe('REGULAR');
    expect(component.onLoadTitle(99)).toBe('REGULAR');
    expect(component.onLoadTitle(50)).toBe('RIESGO');
  });

  it('onValidateNan should check for NaN', () => {
    expect(component.onValidateNan(42)).toBe(true);
    expect(component.onValidateNan(NaN)).toBe(false);
  });

  it('onFilter should aggregate data correctly', () => {
    const data = [
      { solicitudesPendientes: 2, solicitudesAtendidas: 8 },
      { solicitudesPendientes: 3, solicitudesAtendidas: 7 },
    ];

    const result = component.onFilter(data);

    expect(result.totalPendiente).toBe(5);
    expect(result.totalConcluido).toBe(15);
    expect(result.totalItems).toBe(20);
  });

  it('onLoaDTOtal should return 0', () => {
    expect(component.onLoaDTOtal()).toBe(0);
  });
});
