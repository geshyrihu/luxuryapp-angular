import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileConfirmPopup } from './confirm-popup';

describe('MobileConfirmPopup', () => {
  let component: MobileConfirmPopup;
  let fixture: ComponentFixture<MobileConfirmPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileConfirmPopup],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileConfirmPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
