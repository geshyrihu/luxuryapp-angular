import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomButtonEdit } from './custom-button-edit';
import { vi } from 'vitest';

describe('CustomButtonEdit', () => {
  let component: CustomButtonEdit;
  let fixture: ComponentFixture<CustomButtonEdit>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonEdit],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomButtonEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have info severity, rounded true, and small size by default', () => {
    expect(component.severity()).toBe('info');
    expect(component.rounded()).toBe(true);
    expect(component.size()).toBe('small');
  });

  it('should default finalIcon to mdi:pencil', () => {
    expect(component.finalIcon()).toBe('mdi:pencil');
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
