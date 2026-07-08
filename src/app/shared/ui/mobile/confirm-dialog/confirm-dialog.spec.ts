import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileConfirmDialog } from './confirm-dialog';

describe('MobileConfirmDialog', () => {
  let component: MobileConfirmDialog;
  let fixture: ComponentFixture<MobileConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileConfirmDialog],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
