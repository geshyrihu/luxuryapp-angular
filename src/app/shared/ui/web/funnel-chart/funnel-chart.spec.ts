import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FunnelChart } from './funnel-chart';

describe('FunnelChart', () => {
  let component: FunnelChart;
  let fixture: ComponentFixture<FunnelChart>;

  beforeEach(async () => {
    // ChartWrapper (Chart.js) inyecta ElementRef en contexto no soportado
    // bajo vitest; se prueba el wrapper con la plantilla sustituida.
    TestBed.overrideComponent(FunnelChart, {
      set: { template: '<div></div>', imports: [] },
    });
    await TestBed.configureTestingModule({
      imports: [FunnelChart],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FunnelChart);
    fixture.componentRef.setInput('labels', ['A', 'B']);
    fixture.componentRef.setInput('values', [10, 5]);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
