import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebInputNgSelect } from './input-ng-select';
import { vi } from 'vitest';

vi.mock('../custom-input-ng-select-signal', () => ({
  CustomInputNgSelect: class {},
}));

describe('WebInputNgSelect', () => {
  let component: WebInputNgSelect;
  let fixture: ComponentFixture<WebInputNgSelect>;

  beforeEach(() => {
    TestBed.overrideComponent(WebInputNgSelect, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [WebInputNgSelect],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WebInputNgSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register onChange callback', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange('test');
    expect(fn).toHaveBeenCalledWith('test');
  });

  it('should register onTouched callback', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
