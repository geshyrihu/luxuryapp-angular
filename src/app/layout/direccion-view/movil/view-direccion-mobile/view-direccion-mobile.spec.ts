import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewDireccionMobile } from './view-direccion-mobile';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', () => ({
  IonApp: class {},
  IonContent: class {},
  IonHeader: class {},
  IonToolbar: class {},
  IonSpinner: class {},
  IonButton: class {},
  IonButtons: class {},
  IonMenuButton: class {},
  IonTitle: class {},
  IonIcon: class {},
  IonAvatar: class {},
  IonPopover: class {},
  IonItem: class {},
  IonLabel: class {},
  IonList: class {},
  IonSelect: class {},
  IonSelectOption: class {},
  IonNote: class {},
}));

describe('ViewDireccionMobile', () => {
  let component: ViewDireccionMobile;
  let fixture: ComponentFixture<ViewDireccionMobile>;

  beforeEach(() => {
    TestBed.overrideComponent(ViewDireccionMobile, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ViewDireccionMobile],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ViewDireccionMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
