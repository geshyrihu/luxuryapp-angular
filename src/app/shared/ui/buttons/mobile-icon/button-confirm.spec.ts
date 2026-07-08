import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIconConfirm } from './button-confirm';

describe('MobileButtonIconConfirm', () => {
  let component: MobileButtonIconConfirm;
  let fixture: ComponentFixture<MobileButtonIconConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIconConfirm],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonIconConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
