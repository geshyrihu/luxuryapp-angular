import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIconEdit } from './button-edit';

describe('MobileButtonIconEdit', () => {
  let component: MobileButtonIconEdit;
  let fixture: ComponentFixture<MobileButtonIconEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIconEdit],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonIconEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
