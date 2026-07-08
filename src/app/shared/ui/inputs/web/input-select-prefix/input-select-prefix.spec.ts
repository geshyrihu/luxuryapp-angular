import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebInputSelectPrefix } from './input-select-prefix';
import { vi } from 'vitest';

vi.mock('../custom-input-select-prefix-signal', () => ({
  CustomInputSelectPrefix: class {},
}));

describe('WebInputSelectPrefix', () => {
  let component: WebInputSelectPrefix;
  let fixture: ComponentFixture<WebInputSelectPrefix>;

  beforeEach(() => {
    TestBed.overrideComponent(WebInputSelectPrefix, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [WebInputSelectPrefix],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WebInputSelectPrefix);
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
