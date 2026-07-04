import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppIcon } from './app-icon.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppIcon', () => {
  let component: AppIcon;
  let fixture: ComponentFixture<AppIcon>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppIcon],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(AppIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use default icon when no icon input provided', () => {
    expect(component['resolvedIcon']()).toBe('mdi:settings');
  });

  it('should resolve iconify icon with colon prefix', () => {
    fixture.componentRef.setInput('icon', 'mdi:home');
    expect(component['resolvedIcon']()).toBe('mdi:home');
  });

  it('should resolve prime icon format', () => {
    fixture.componentRef.setInput('icon', 'pi pi-user');
    expect(component['resolvedIcon']()).toContain(':');
  });

  it('should fallback to default icon for null value', () => {
    fixture.componentRef.setInput('icon', null);
    expect(component['resolvedIcon']()).toBe('mdi:settings');
  });

  it('should fallback to default icon for undefined value', () => {
    fixture.componentRef.setInput('icon', undefined);
    expect(component['resolvedIcon']()).toBe('mdi:settings');
  });
});
