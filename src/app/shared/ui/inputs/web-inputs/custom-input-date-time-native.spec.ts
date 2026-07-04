import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputDateTimeNative } from './custom-input-date-time-native';
import { vi } from 'vitest';

describe('CustomInputDateTimeNative', () => {
  let component: CustomInputDateTimeNative;
  let fixture: ComponentFixture<CustomInputDateTimeNative>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputDateTimeNative, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputDateTimeNative],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputDateTimeNative);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signal defaults', () => {
    it('should have default values', () => {
      expect(component.timePart()).toBe('');
      expect(component.horizontal()).toBe(true);
      expect(component.required()).toBe(false);
      expect(component.label()).toBe('');
    });

    it('should generate a random id', () => {
      expect(component.id()).toMatch(/^dtn-/);
    });

    it('should have a default FormControl', () => {
      expect(component.control()).toBeDefined();
    });
  });

  describe('onTimeChange', () => {
    it('should update timePart signal from event', () => {
      const event = { target: { value: '14:30' } } as unknown as Event;
      component.onTimeChange(event);
      expect(component.timePart()).toBe('14:30');
    });
  });
});
