import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputMaskSignal } from './custom-input-mask-signal';
import { vi } from 'vitest';

describe('CustomInputMaskSignal', () => {
  let component: CustomInputMaskSignal;
  let fixture: ComponentFixture<CustomInputMaskSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputMaskSignal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputMaskSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputMaskSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default signal values', () => {
    it('should have default size as undefined', () => {
      expect(component.size()).toBeUndefined();
    });
  });

  describe('required inputs', () => {
    it('should accept customMask input', () => {
      fixture.componentRef.setInput('customMask', '000-000-0000');
      fixture.detectChanges();
      expect(component.customMask()).toBe('000-000-0000');
    });
  });
});
