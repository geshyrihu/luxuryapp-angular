import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FunnelChart } from './funnel-chart';

describe('FunnelChart', () => {
  let component: FunnelChart;
  let fixture: ComponentFixture<FunnelChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunnelChart],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FunnelChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
