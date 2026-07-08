import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileStepper } from './stepper';

describe('MobileStepper', () => {
  let component: MobileStepper;
  let fixture: ComponentFixture<MobileStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileStepper],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileStepper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
