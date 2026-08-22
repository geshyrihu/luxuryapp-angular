import { vi } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RecurrenceInput } from './recurrence-input';

describe('RecurrenceInput', () => {
  let component: RecurrenceInput;
  let fixture: ComponentFixture<RecurrenceInput>;

  beforeEach(() => {
    TestBed.overrideComponent(RecurrenceInput, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [RecurrenceInput],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(RecurrenceInput);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.rrulePreview()).toBe('');
    expect(component.label()).toBe('Regla de Recurrencia');
  });

  it('should have default form values', () => {
    expect(component.recurrenceForm.controls.frequency.value).toBeNull();
    expect(component.recurrenceForm.controls.interval.value).toBe(1);
    expect(component.recurrenceForm.controls.monthlyType.value).toBe('dayOfMonth');
  });

  it('should generate empty rrule when frequency is null', () => {
    const onChangeSpy = vi.fn();
    component.registerOnChange(onChangeSpy);

    component.generateRRule();

    expect(onChangeSpy).toHaveBeenCalledWith('');
    expect(component.rrulePreview()).toBe('');
  });

  it('should generate daily rrule', () => {
    component.recurrenceForm.patchValue({ frequency: 'DAILY', interval: 1 });
    component.generateRRule();
    expect(component.rrulePreview()).toBe('FREQ=DAILY');
  });

  it('should generate daily rrule with interval', () => {
    component.recurrenceForm.patchValue({ frequency: 'DAILY', interval: 3 });
    component.generateRRule();
    expect(component.rrulePreview()).toBe('FREQ=DAILY;INTERVAL=3');
  });

  it('should generate weekly rrule with byDay', () => {
    component.recurrenceForm.patchValue({
      frequency: 'WEEKLY',
      interval: 1,
      byDay: ['MO', 'FR'],
    });
    component.generateRRule();
    expect(component.rrulePreview()).toBe('FREQ=WEEKLY;BYDAY=MO,FR');
  });

  it('should generate monthly rrule by day of month', () => {
    component.recurrenceForm.patchValue({
      frequency: 'MONTHLY',
      interval: 1,
      monthlyType: 'dayOfMonth',
      monthDays: [15],
    });
    component.generateRRule();
    expect(component.rrulePreview()).toBe('FREQ=MONTHLY;BYMONTHDAY=15');
  });

  it('should generate monthly rrule with multiple days of month', () => {
    component.recurrenceForm.patchValue({
      frequency: 'MONTHLY',
      interval: 1,
      monthlyType: 'dayOfMonth',
      monthDays: [5, 20],
    });
    component.generateRRule();
    expect(component.rrulePreview()).toBe('FREQ=MONTHLY;BYMONTHDAY=5,20');
  });

  it('should generate monthly rrule for last day of month without mixing monthDays', () => {
    component.recurrenceForm.patchValue({
      frequency: 'MONTHLY',
      interval: 1,
      monthlyType: 'lastDayOfMonth',
      monthDays: [5, 20],
    });
    component.generateRRule();
    expect(component.rrulePreview()).toBe('FREQ=MONTHLY;BYMONTHDAY=-1');
  });

  it('should generate monthly rrule by day of week', () => {
    component.recurrenceForm.patchValue({
      frequency: 'MONTHLY',
      interval: 1,
      monthlyType: 'dayOfWeek',
      monthPosition: '1',
      monthWeekDay: 'MO',
    });
    component.generateRRule();
    expect(component.rrulePreview()).toBe('FREQ=MONTHLY;BYDAY=1MO');
  });

  it('should generate yearly rrule', () => {
    component.recurrenceForm.patchValue({
      frequency: 'YEARLY',
      interval: 1,
      yearMonth: 6,
      yearDay: 15,
    });
    component.generateRRule();
    expect(component.rrulePreview()).toBe('FREQ=YEARLY;BYMONTH=6;BYMONTHDAY=15');
  });

  it('should parse rrule string and set form values', () => {
    component.parseRRule('FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE,FR');

    expect(component.recurrenceForm.controls.frequency.value).toBe('WEEKLY');
    expect(component.recurrenceForm.controls.interval.value).toBe(2);
    expect(component.recurrenceForm.controls.byDay.value).toEqual(['MO', 'WE', 'FR']);
  });

  it('should parse monthly rrule with BYMONTHDAY', () => {
    component.parseRRule('FREQ=MONTHLY;BYMONTHDAY=20');
    expect(component.recurrenceForm.controls.monthlyType.value).toBe('dayOfMonth');
    expect(component.recurrenceForm.controls.monthDays.value).toEqual([20]);
  });

  it('should parse monthly rrule with multiple BYMONTHDAY values', () => {
    component.parseRRule('FREQ=MONTHLY;BYMONTHDAY=5,20');
    expect(component.recurrenceForm.controls.monthlyType.value).toBe('dayOfMonth');
    expect(component.recurrenceForm.controls.monthDays.value).toEqual([5, 20]);
  });

  it('should parse monthly rrule with last BYMONTHDAY as lastDayOfMonth', () => {
    component.parseRRule('FREQ=MONTHLY;BYMONTHDAY=-1');
    expect(component.recurrenceForm.controls.monthlyType.value).toBe('lastDayOfMonth');
  });

  it('should parse monthly rrule with BYDAY position', () => {
    component.parseRRule('FREQ=MONTHLY;BYDAY=-1FR');
    expect(component.recurrenceForm.controls.monthlyType.value).toBe('dayOfWeek');
    expect(component.recurrenceForm.controls.monthPosition.value).toBe('-1');
    expect(component.recurrenceForm.controls.monthWeekDay.value).toBe('FR');
  });

  it('should parse yearly rrule', () => {
    component.parseRRule('FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25');
    expect(component.recurrenceForm.controls.yearMonth.value).toBe(12);
    expect(component.recurrenceForm.controls.yearDay.value).toBe(25);
  });

  it('should reset form on writeValue(null)', () => {
    component.recurrenceForm.patchValue({ frequency: 'DAILY' });
    component.writeValue(null as any);

    expect(component.recurrenceForm.controls.frequency.value).toBeNull();
    expect(component.rrulePreview()).toBe('');
  });

  it('should clear byDay when frequency changes from weekly', () => {
    component.recurrenceForm.patchValue({ frequency: 'WEEKLY', byDay: ['MO'] });
    component.onFrequencyChange({ value: 'DAILY' });
    expect(component.recurrenceForm.controls.byDay.value).toEqual([]);
  });

  it('should expose computed getters', () => {
    expect(component.isWeekly).toBe(false);
    expect(component.isMonthly).toBe(false);
    expect(component.isYearly).toBe(false);
    expect(component.selectedFrequency).toBeNull();
    expect(component.currentFrequencyLabel).toBe('');
    expect(component.monthlyType).toBe('dayOfMonth');
  });
});
