import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChartWrapper } from './chart-wrapper';

describe('ChartWrapper', () => {
  let component: ChartWrapper;
  let fixture: ComponentFixture<ChartWrapper>;

  beforeEach(() => {
    TestBed.overrideComponent(ChartWrapper, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ChartWrapper],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ChartWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
