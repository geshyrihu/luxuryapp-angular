import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { IonButtonDownload } from './ion-button-download';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');

  @Component({ selector: 'ion-button', template: '<ng-content></ng-content>', standalone: true })
  class IonButtonMock {}

  @Component({ selector: 'ion-icon', template: '', standalone: true })
  class IonIconMock {}

  return { IonButton: IonButtonMock, IonIcon: IonIconMock };
});

describe('IonButtonDownload', () => {
  let component: IonButtonDownload;
  let fixture: ComponentFixture<IonButtonDownload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonButtonDownload],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IonButtonDownload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have medium color and clear fill by default', () => {
    expect(component.color()).toBe('medium');
    expect(component.fill()).toBe('clear');
  });

  it('should emit onClick on click', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    component.onClick(new MouseEvent('click'));
    expect(spy).toHaveBeenCalled();
  });

  it('should hide when mostrar() is false', () => {
    fixture.componentRef.setInput('mostrar', false);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('ion-button');
    expect(btn).toBeNull();
  });
});
