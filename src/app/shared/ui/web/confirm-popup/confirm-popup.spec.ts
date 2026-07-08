import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopup } from './confirm-popup';

describe('ConfirmPopup', () => {
  let component: ConfirmPopup;
  let fixture: ComponentFixture<ConfirmPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPopup],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ConfirmationService, useValue: { confirm: () => {}, close: () => {} } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
