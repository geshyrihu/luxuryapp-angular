import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomBtnActiveDesactive } from './custom-button-active-desactive';
import { vi } from 'vitest';

describe('CustomBtnActiveDesactive', () => {
  let component: CustomBtnActiveDesactive;
  let fixture: ComponentFixture<CustomBtnActiveDesactive>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomBtnActiveDesactive],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomBtnActiveDesactive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have secondary severity and fluid true by default', () => {
    expect(component.severity()).toBe('secondary');
    expect(component.fluid()).toBe(true);
  });

  it('should show "Inactivos" when state is true', () => {
    fixture.componentRef.setInput('state', true);
    fixture.detectChanges();
    expect(component.dynamicLabel()).toBe('Inactivos');
  });

  it('should show "Activos" when state is false', () => {
    fixture.componentRef.setInput('state', false);
    fixture.detectChanges();
    expect(component.dynamicLabel()).toBe('Activos');
  });

  it('should use custom labels when provided', () => {
    fixture.componentRef.setInput('activasLabel', 'CustomActive');
    fixture.componentRef.setInput('inactivasLabel', 'CustomInactive');
    fixture.detectChanges();
    expect(component.dynamicLabel()).toBe('CustomInactive');
    fixture.componentRef.setInput('state', false);
    fixture.detectChanges();
    expect(component.dynamicLabel()).toBe('CustomActive');
  });

  it('should emit stateChange on toggle with opposite value', () => {
    const spy = vi.fn();
    component.stateChange.subscribe(spy);
    fixture.componentRef.setInput('state', true);
    fixture.detectChanges();
    component.toggleState();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should have correct CSS classes based on state', () => {
    fixture.componentRef.setInput('state', true);
    fixture.detectChanges();
    expect(component.stateClasses()).toContain('btn-outline-success');

    fixture.componentRef.setInput('state', false);
    fixture.detectChanges();
    expect(component.stateClasses()).toContain('btn-outline-danger');
  });
});
