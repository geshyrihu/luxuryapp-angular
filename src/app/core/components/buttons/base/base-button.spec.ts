import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BaseButton } from './base-button';
import { TooltipPlacement } from '../../../enums/tooltip-placement';

@Component({
  template: `<button [class]="btnClasses()" (click)="onClick($event)"></button>`,
  imports: [],
  standalone: true,
})
class TestButton extends BaseButton {}

describe('BaseButton', () => {
  let component: TestButton;
  let fixture: ComponentFixture<TestButton>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestButton],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(TestButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default disabled false', () => {
    expect(component.disabled()).toBe(false);
  });

  it('should emit clicked event on onClick', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    const event = new MouseEvent('click');
    component.onClick(event);
    expect(spy).toHaveBeenCalledWith(event);
  });

  it('should resolve icon from icon input', () => {
    fixture.componentRef.setInput('icon', 'mdi:home');
    fixture.detectChanges();
    expect(component.resolvedIcon()).toBe('mdi:home');
  });

  it('should resolve icon from iconClass input', () => {
    fixture.componentRef.setInput('iconClass', 'pi pi-user');
    fixture.detectChanges();
    expect(component.resolvedIcon()).toContain(':');
  });

  it('should resolve icon from emoji input', () => {
    fixture.componentRef.setInput('emoji', 'mdi:star');
    fixture.detectChanges();
    expect(component.resolvedIcon()).toBe('mdi:star');
  });

  it('should return empty resolved icon when no icon provided', () => {
    expect(component.resolvedIcon()).toBe('');
  });

  it('should generate btn-primary class by default', () => {
    expect(component.btnClasses()).toContain('btn-primary');
  });

  it('should include btn-sm class when size is small', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();
    expect(component.btnClasses()).toContain('btn-sm');
  });

  it('should include btn-lg class when size is large', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();
    expect(component.btnClasses()).toContain('btn-lg');
  });

  it('should include btn-block class when fluid is true', () => {
    fixture.componentRef.setInput('fluid', true);
    fixture.detectChanges();
    expect(component.btnClasses()).toContain('btn-block');
  });

  it('should include btn-outline class for outlined variant', () => {
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.detectChanges();
    expect(component.btnClasses()).toContain('btn-outline');
  });

  it('should include btn-ghost class for text variant', () => {
    fixture.componentRef.setInput('variant', 'text');
    fixture.detectChanges();
    expect(component.btnClasses()).toContain('btn-ghost');
  });

  it('should include btn--circle class for rounded without label', () => {
    fixture.componentRef.setInput('rounded', true);
    fixture.detectChanges();
    expect(component.btnClasses()).toContain('btn--circle');
  });

  it('should include btn--pill class for rounded with label', () => {
    fixture.componentRef.setInput('rounded', true);
    fixture.componentRef.setInput('showLabelOnDesktop', true);
    fixture.componentRef.setInput('label', 'Click');
    fixture.detectChanges();
    expect(component.btnClasses()).toContain('btn--pill');
  });

  it('should generate iconShellClasses with correct severity', () => {
    const classes = component.iconShellClasses(true);
    expect(classes).toContain('btn-icon-shell');
    expect(classes).toContain('btn-icon-shell--primary');
  });

  it('should normalize warn severity to warning', () => {
    fixture.componentRef.setInput('severity', 'warn');
    fixture.detectChanges();
    expect(component.btnClasses()).toContain('btn-warning');
  });
});
