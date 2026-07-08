import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonInputUploadPdf } from './ion-input-upload-pdf';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', () => ({
  IonInput: class {},
  IonNote: class {},
  IonSelect: class {},
  IonSelectOption: class {},
  IonTextarea: class {},
  IonToggle: class {},
  IonDatetime: class {},
  IonCheckbox: class {},
  IonSearchbar: class {},
  IonButton: class {},
  IonIcon: class {},
  IonModal: class {},
  IonHeader: class {},
  IonToolbar: class {},
  IonTitle: class {},
  IonButtons: class {},
  IonContent: class {},
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

describe('IonInputUploadPdf', () => {
  let component: IonInputUploadPdf;
  let fixture: ComponentFixture<IonInputUploadPdf>;

  beforeEach(() => {
    TestBed.overrideComponent(IonInputUploadPdf, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [IonInputUploadPdf],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(IonInputUploadPdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register onChange callback', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange('test');
    expect(fn).toHaveBeenCalledWith('test');
  });

  it('should register onTouched callback', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
