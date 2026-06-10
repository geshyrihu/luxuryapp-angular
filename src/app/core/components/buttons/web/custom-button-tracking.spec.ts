import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomButtonTracking } from './custom-button-tracking';
import { vi } from 'vitest';

describe('CustomButtonTracking', () => {
  let component: CustomButtonTracking;
  let fixture: ComponentFixture<CustomButtonTracking>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonTracking],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomButtonTracking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have rounded true by default', () => {
    expect(component.rounded()).toBe(true);
  });

  it('should default finalIcon to mdi:map-marker', () => {
    expect(component.finalIcon()).toBe('mdi:map-marker');
  });

  it('should emit clickTracking with ticketId and title on click', () => {
    const spy = vi.fn();
    component.clickTracking.subscribe(spy);
    fixture.componentRef.setInput('ticketId', '123');
    fixture.componentRef.setInput('title', 'Test Tracking');
    fixture.detectChanges();

    component.onTrackingClick(new MouseEvent('click'));
    expect(spy).toHaveBeenCalledWith({ ticketId: '123', title: 'Test Tracking' });
  });

  it('should stop event propagation on click', () => {
    const event = new MouseEvent('click');
    vi.spyOn(event, 'stopPropagation');
    component.onTrackingClick(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should disable button when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
