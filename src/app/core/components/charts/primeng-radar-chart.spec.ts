import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PrimengRadarChart } from './primeng-radar-chart';

describe('PrimengRadarChart', () => {
  let component: PrimengRadarChart;
  let fixture: ComponentFixture<PrimengRadarChart>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrimengRadarChart],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(PrimengRadarChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty labels by default', () => {
    expect(component.chartData().labels).toEqual([]);
  });

  it('should have "Cargando..." label by default', () => {
    expect(component.chartData().datasets[0].label).toBe('Cargando...');
  });

  it('should have responsive option by default', () => {
    expect(component.chartOptions()?.responsive).toBe(true);
  });

  it('should return undefined for getBase64Image when chart is not initialized', () => {
    expect(component.getBase64Image()).toBeUndefined();
  });

  it('should not throw on reinit when chart is not initialized', () => {
    expect(() => component.reinit()).not.toThrow();
  });

  it('should accept custom chart data', { timeout: 15000 }, () => {
    const testData = {
      labels: ['Speed', 'Strength'],
      datasets: [{ data: [80, 90], label: 'Player 1' }],
    };
    fixture.componentRef.setInput('chartData', testData);
    fixture.detectChanges();
    expect(component.chartData().labels).toEqual(['Speed', 'Strength']);
  });

  it('should handle data with empty values gracefully', () => {
    const emptyData = { labels: ['Test'], datasets: [{ data: [], label: 'Empty' }] };
    fixture.componentRef.setInput('chartData', emptyData);
    fixture.detectChanges();
    expect(component.chartData().labels).toEqual(['Test']);
    expect(component.chartData().datasets[0].data).toEqual([]);
  });
});
