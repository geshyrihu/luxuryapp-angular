import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DateRange } from './date-range';

describe('DateRange', () => {
  let component: DateRange;
  let fixture: ComponentFixture<DateRange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRange],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DateRange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
