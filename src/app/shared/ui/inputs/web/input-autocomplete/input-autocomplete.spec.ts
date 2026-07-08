import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebInputAutocomplete } from './input-autocomplete';
import { vi } from 'vitest';

vi.mock('../custom-input-autocomplete-signal', () => ({
  CustomInputAutoComplete: class {},
}));

describe('WebInputAutocomplete', () => {
  let component: WebInputAutocomplete;
  let fixture: ComponentFixture<WebInputAutocomplete>;

  beforeEach(() => {
    TestBed.overrideComponent(WebInputAutocomplete, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [WebInputAutocomplete],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WebInputAutocomplete);
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
