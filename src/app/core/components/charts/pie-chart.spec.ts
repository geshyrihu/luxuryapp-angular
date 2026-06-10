import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PieChart } from './pie-chart';

describe('PieChart', () => {
  let component: PieChart;
  let fixture: ComponentFixture<PieChart>;

  beforeEach(async () => {
    TestBed.overrideComponent(PieChart, {
      set: {
        template: '<div>Mock PieChart</div>',
        imports: [],
      },
    });

    await TestBed.configureTestingModule({
      imports: [PieChart],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default data', () => {
    expect(component.dataGrafico().length).toBe(2);
    expect(component.dataGrafico()[0].name).toBe('Germany');
  });

  it('should have default color scheme', () => {
    expect(component.colorScheme().domain.length).toBe(2);
  });

  it('should have default view dimensions', () => {
    expect(component.view).toEqual([700, 400]);
  });

  it('should have gradient enabled by default', () => {
    expect(component.gradient).toBe(true);
  });

  it('should have legend below by default', () => {
    expect(component.legendPosition).toBe('below');
  });
});
