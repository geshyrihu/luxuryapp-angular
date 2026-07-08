import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIconAdd } from './button-add';

describe('MobileButtonIconAdd', () => {
  let component: MobileButtonIconAdd;
  let fixture: ComponentFixture<MobileButtonIconAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIconAdd],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonIconAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
