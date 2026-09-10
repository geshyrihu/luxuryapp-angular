import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { TaskDateRangeSelector } from './task-date-range-selector';
import { DateRangeStorageService } from '../../services/date-range-storage.service';

describe('TaskDateRangeSelector', () => {
  let component: TaskDateRangeSelector;
  let fixture: ComponentFixture<TaskDateRangeSelector>;
  let mockDateRangeStorageS: any;

  beforeEach(() => {
    mockDateRangeStorageS = {
      getDateRange: vi.fn().mockReturnValue({ from: null, to: null }),
      saveDateRange: vi.fn(),
    };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskDateRangeSelector, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskDateRangeSelector],
      providers: [
        { provide: DateRangeStorageService, useValue: mockDateRangeStorageS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskDateRangeSelector);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default dateRangeControl with null values', () => {
    const val = component.dateRangeControl.value;
    expect(val.from).toBeNull();
    expect(val.to).toBeNull();
  });

  it('onDateChange should update control', () => {
    const dates = { from: new Date('2024-01-01'), to: new Date('2024-01-31') };
    component.onDateChange(dates);
    expect(component.dateRangeControl.value).toEqual(dates);
  });

  it('emitSelectedDates should emit and save when from and to are set', () => {
    const from = new Date('2024-01-01');
    const to = new Date('2024-01-31');
    component.dateRangeControl.setValue({ from, to });
    const spy = vi.spyOn(component.selectedDates, 'emit');

    component.emitSelectedDates();

    expect(spy).toHaveBeenCalledWith({ startDate: from, endDate: to });
    expect(mockDateRangeStorageS.saveDateRange).toHaveBeenCalledWith(from, to);
  });

  it('emitSelectedDates should not emit when from or to is null', () => {
    component.dateRangeControl.setValue({ from: null, to: null });
    const spy = vi.spyOn(component.selectedDates, 'emit');

    component.emitSelectedDates();

    expect(spy).not.toHaveBeenCalled();
  });
});
