import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputSelectBool } from './custom-input-select-bool-signal';
import { vi } from 'vitest';

describe('CustomInputSelectBool', () => {
  let component: CustomInputSelectBool;
  let fixture: ComponentFixture<CustomInputSelectBool>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputSelectBool, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputSelectBool],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputSelectBool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default signal values', () => {
    it('should have default activeLabel as "Activo"', () => {
      expect(component.activeLabel()).toBe('Activo');
    });

    it('should have default inactiveLabel as "Inactivo"', () => {
      expect(component.inactiveLabel()).toBe('Inactivo');
    });

    it('should have default showClear as true', () => {
      expect(component.showClear()).toBe(true);
    });

    it('should have default size as undefined', () => {
      expect(component.size()).toBeUndefined();
    });
  });

});
