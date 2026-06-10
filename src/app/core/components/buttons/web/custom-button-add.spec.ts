import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomButtonAdd } from './custom-button-add';

describe('CustomButtonAdd', () => {
  let component: CustomButtonAdd;
  let fixture: ComponentFixture<CustomButtonAdd>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonAdd],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomButtonAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have primary severity by default', () => {
    expect(component.severity()).toBe('primary');
  });

  it('should have outlined variant by default', () => {
    expect(component.variant()).toBe('outlined');
  });

  it('should have fluid true by default', () => {
    expect(component.fluid()).toBe(true);
  });

  it('should default finalIcon to mdi:plus', () => {
    expect(component.finalIcon()).toBe('mdi:plus');
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
});
