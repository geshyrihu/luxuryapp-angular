import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomButtonItem } from './custom-button-item';
import { vi } from 'vitest';

describe('CustomButtonItem', () => {
  let component: CustomButtonItem;
  let fixture: ComponentFixture<CustomButtonItem>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonItem],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomButtonItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have secondary severity, rounded true, small size, and showLabelOnDesktop false by default', () => {
    expect(component.severity()).toBe('secondary');
    expect(component.rounded()).toBe(true);
    expect(component.size()).toBe('small');
    expect(component.showLabelOnDesktop()).toBe(false);
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

  it('should return tooltip from getTooltip computed', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();
    expect(component.getTooltip()).toBe('Test Label');
  });

  it('should return empty string for getTooltip when no tooltip or label', () => {
    expect(component.getTooltip()).toBe('');
  });
});
