import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MobileModal } from './modal';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', () => ({
  IonModal: class {},
  IonHeader: class {},
  IonToolbar: class {},
  IonTitle: class {},
  IonButtons: class {},
  IonButton: class {},
  IonContent: class {},
  IonIcon: class {},
  IonInput: class {},
  IonNote: class {},
  IonSelect: class {},
  IonSelectOption: class {},
  IonTextarea: class {},
  IonToggle: class {},
  IonDatetime: class {},
  IonCheckbox: class {},
  IonSearchbar: class {},
  IonDatetimeButton: class {},
  IonList: class {},
  IonItem: class {},
  IonLabel: class {},
  IonCard: class {},
  IonCardContent: class {},
  IonCardHeader: class {},
  IonCardTitle: class {},
  IonProgressBar: class {},
  IonSpinner: class {},
  IonInfiniteScroll: class {},
  IonInfiniteScrollContent: class {},
  IonImg: class {},
}));

describe('MobileModal', () => {
  let component: MobileModal;
  let fixture: ComponentFixture<MobileModal>;

  beforeEach(() => {
    TestBed.overrideComponent(MobileModal, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [MobileModal],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(MobileModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss and emit', () => {
    const fn = vi.fn();
    component.dismiss.subscribe(fn);
    component.onDismiss();
    expect(component.visible()).toBe(false);
    expect(fn).toHaveBeenCalled();
  });
});
