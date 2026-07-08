import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonLabel } from './button';

describe('MobileButtonLabel', () => {
  let component: MobileButtonLabel;
  let fixture: ComponentFixture<MobileButtonLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonLabel],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
