import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebInputUrl } from './input-url';
import { vi } from 'vitest';

vi.mock('../custom-input-url-signal', () => ({
  CustomInputUrl: class {},
}));

describe('WebInputUrl', () => {
  let component: WebInputUrl;
  let fixture: ComponentFixture<WebInputUrl>;

  beforeEach(() => {
    TestBed.overrideComponent(WebInputUrl, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [WebInputUrl],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WebInputUrl);
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
