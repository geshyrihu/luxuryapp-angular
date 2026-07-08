import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebInputPhonePrefix } from './input-phone-prefix';
import { vi } from 'vitest';

vi.mock('../custom-input-phone-prefix', () => ({
  CustomInputPhonePrefix: class {},
}));

describe('WebInputPhonePrefix', () => {
  let component: WebInputPhonePrefix;
  let fixture: ComponentFixture<WebInputPhonePrefix>;

  beforeEach(() => {
    TestBed.overrideComponent(WebInputPhonePrefix, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [WebInputPhonePrefix],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WebInputPhonePrefix);
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
