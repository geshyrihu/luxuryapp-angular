import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { IonButtonTracking } from './ion-button-tracking';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');

  @Component({ selector: 'ion-button', template: '<ng-content></ng-content>', standalone: true })
  class IonButtonMock {}

  @Component({ selector: 'ion-icon', template: '', standalone: true })
  class IonIconMock {}

  @Component({ selector: 'ion-badge', template: '<ng-content></ng-content>', standalone: true })
  class IonBadgeMock {}

  return { IonButton: IonButtonMock, IonIcon: IonIconMock, IonBadge: IonBadgeMock };
});

describe('IonButtonTracking', () => {
  let component: IonButtonTracking;
  let fixture: ComponentFixture<IonButtonTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonButtonTracking],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IonButtonTracking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have medium color by default', () => {
    expect(component.color()).toBe('medium');
  });

  it('should emit clickTracking with ticketId and title on click', () => {
    const spy = vi.fn();
    component.clickTracking.subscribe(spy);
    fixture.componentRef.setInput('ticketId', '123');
    fixture.componentRef.setInput('title', 'Test');
    fixture.detectChanges();

    component.onTrackingClick(new MouseEvent('click'));
    expect(spy).toHaveBeenCalledWith({ ticketId: '123', title: 'Test' });
  });

  it('should stop event propagation on click', () => {
    const event = new MouseEvent('click');
    vi.spyOn(event, 'stopPropagation');
    component.onTrackingClick(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should hide when mostrar() is false', () => {
    fixture.componentRef.setInput('mostrar', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).not.toContain('ion-button');
  });
});
