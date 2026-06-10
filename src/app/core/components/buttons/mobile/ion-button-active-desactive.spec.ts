import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { IonButtonActiveDesactive } from './ion-button-active-desactive';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');

  @Component({ selector: 'ion-button', template: '<ng-content></ng-content>', standalone: true })
  class IonButtonMock {}

  @Component({ selector: 'ion-icon', template: '', standalone: true })
  class IonIconMock {}

  return { IonButton: IonButtonMock, IonIcon: IonIconMock };
});

describe('IonButtonActiveDesactive', () => {
  let component: IonButtonActiveDesactive;
  let fixture: ComponentFixture<IonButtonActiveDesactive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonButtonActiveDesactive],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IonButtonActiveDesactive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have outline fill by default', () => {
    expect(component.fill()).toBe('outline');
  });

  it('should show "Inactivas" when state is true', () => {
    fixture.componentRef.setInput('state', true);
    fixture.detectChanges();
    expect(component.dynamicLabel()).toBe('Inactivas');
  });

  it('should show "Activas" when state is false', () => {
    fixture.componentRef.setInput('state', false);
    fixture.detectChanges();
    expect(component.dynamicLabel()).toBe('Activas');
  });

  it('should use custom labels when provided', () => {
    fixture.componentRef.setInput('activasLabel', 'CustomOn');
    fixture.componentRef.setInput('inactivasLabel', 'CustomOff');
    fixture.detectChanges();
    expect(component.dynamicLabel()).toBe('CustomOff');
  });

  it('should emit stateChange on toggle with opposite value', () => {
    const spy = vi.fn();
    component.stateChange.subscribe(spy);
    fixture.componentRef.setInput('state', true);
    fixture.detectChanges();
    component.toggleState();
    expect(spy).toHaveBeenCalledWith(false);
  });
});
