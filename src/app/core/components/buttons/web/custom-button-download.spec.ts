import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomButtonDownload } from './custom-button-download';
import { vi } from 'vitest';

describe('CustomButtonDownload', () => {
  let component: CustomButtonDownload;
  let fixture: ComponentFixture<CustomButtonDownload>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonDownload],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomButtonDownload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have secondary severity and rounded true by default', () => {
    expect(component.severity()).toBe('secondary');
    expect(component.rounded()).toBe(true);
  });

  it('should default finalIcon to mdi:download', () => {
    expect(component.finalIcon()).toBe('mdi:download');
  });

  it('should use icon input for finalIcon when provided', () => {
    fixture.componentRef.setInput('icon', 'mdi:custom');
    fixture.detectChanges();
    expect(component.finalIcon()).toBe('mdi:custom');
  });

  it('should emit clicked on button click', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should disable button when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
