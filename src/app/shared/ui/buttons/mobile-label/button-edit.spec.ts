import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonLabelEdit } from './button-edit';

describe('MobileButtonLabelEdit', () => {
  let component: MobileButtonLabelEdit;
  let fixture: ComponentFixture<MobileButtonLabelEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonLabelEdit],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonLabelEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
