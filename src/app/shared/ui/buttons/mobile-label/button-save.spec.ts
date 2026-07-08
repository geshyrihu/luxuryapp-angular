import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonLabelSave } from './button-save';

describe('MobileButtonLabelSave', () => {
  let component: MobileButtonLabelSave;
  let fixture: ComponentFixture<MobileButtonLabelSave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonLabelSave],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonLabelSave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
