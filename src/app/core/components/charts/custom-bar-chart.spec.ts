import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomBarChart } from './custom-bar-chart';

describe('CustomBarChart', () => {
  let component: CustomBarChart;
  let fixture: ComponentFixture<CustomBarChart>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomBarChart],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomBarChart);
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
    expect(options.maintainAspectRatio).toBe(false);
    expect(options.aspectRatio).toBe(0.6);
  });

  it('should use provided data', () => {
    const testData = {
      labels: ['A', 'B'],
      datasets: [{ label: 'Test', data: [1, 2], fill: false, borderColor: '#000', tension: 0.4 }],
    };
    fixture.componentRef.setInput('data', testData);
    fixture.detectChanges();
    expect(component.dataSignal()).toEqual(testData);
  });

  it('should use provided options over defaults', () => {
    const testOptions = { maintainAspectRatio: true, aspectRatio: 1 };
    fixture.componentRef.setInput('options', testOptions);
    fixture.detectChanges();
    expect(component.chartOptions()).toEqual(testOptions);
  });
});
