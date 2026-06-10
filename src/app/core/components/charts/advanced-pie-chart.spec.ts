import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AdvancedPieChart } from './advanced-pie-chart';

describe('AdvancedPieChart', () => {
  let component: AdvancedPieChart;
  let fixture: ComponentFixture<AdvancedPieChart>;

  beforeEach(async () => {
    TestBed.overrideComponent(AdvancedPieChart, {
      set: {
        template: '<div>Mock AdvancedPieChart</div>',
        imports: [],
      },
    });

    await TestBed.configureTestingModule({
      imports: [AdvancedPieChart],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedPieChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty data by default', () => {
    expect(component.dataGrafico()).toEqual([]);
  });

  it('should have default color scheme with 3 colors', () => {
    expect(component.colorScheme().domain.length).toBe(3);
  });

  it('should have default view dimensions', () => {
    expect(component.view).toEqual([700, 400]);
  });

  it('should accept custom data', () => {
    const testData = [{ name: 'Test', value: 100 }];
    fixture.componentRef.setInput('dataGrafico', testData);
    fixture.detectChanges();
    expect(component.dataGrafico()).toEqual(testData);
  });
});
