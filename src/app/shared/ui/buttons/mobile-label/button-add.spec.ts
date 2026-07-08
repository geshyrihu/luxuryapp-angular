import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonLabelAdd } from './button-add';

describe('MobileButtonLabelAdd', () => {
  let component: MobileButtonLabelAdd;
  let fixture: ComponentFixture<MobileButtonLabelAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonLabelAdd],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonLabelAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
