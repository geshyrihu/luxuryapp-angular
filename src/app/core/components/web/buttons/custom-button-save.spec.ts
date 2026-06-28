import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomButtonSave } from './custom-button-save';
import { vi } from 'vitest';

describe('CustomButtonSave', () => {
  let component: CustomButtonSave;
  let fixture: ComponentFixture<CustomButtonSave>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonSave],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomButtonSave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have primary severity and submit type by default', () => {
    expect(component.severity()).toBe('primary');
    expect(component.type()).toBe('submit');
  });

  it('should show "Guardar" when propertyId is null', () => {
    expect(component.finalLabel()).toBe('Guardar');
  });

  it('should show "Actualizar" when propertyId is provided', () => {
    fixture.componentRef.setInput('propertyId', '123');
    fixture.detectChanges();
    expect(component.finalLabel()).toBe('Actualizar');
  });

  it('should show loading icon when submitting is true', () => {
    fixture.componentRef.setInput('submitting', true);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('app-icon');
    expect(icon.getAttribute('icon')).toBe('mdi:loading');
  });

  it('should disable button when submitting is true', () => {
    fixture.componentRef.setInput('submitting', true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('should emit clicked on button click', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalled();
  });
});
