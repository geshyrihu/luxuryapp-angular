import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MultiAxisChart } from './multi-axis-chart';

describe('MultiAxisChart', () => {
  let component: MultiAxisChart;
  let fixture: ComponentFixture<MultiAxisChart>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MultiAxisChart],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(MultiAxisChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have null data by default', () => {
    expect(component.dataSignal()).toBeNull();
  });

  it('should generate default chart options when none provided', () => {
    const options = component.chartOptions();
    expect(options).toBeTruthy();
    expect(options.stacked).toBe(false);
    expect(options.maintainAspectRatio).toBe(false);
  });

  it('should use provided data', () => {
    const testData = { labels: ['A', 'B'], datasets: [] };
    fixture.componentRef.setInput('data', testData);
    fixture.detectChanges();
    expect(component.dataSignal()).toEqual(testData);
  });

  it('should use provided options over defaults', () => {
    const testOptions = { stacked: true };
    fixture.componentRef.setInput('options', testOptions);
    fixture.detectChanges();
    expect(component.chartOptions()).toEqual(testOptions);
  });
});
