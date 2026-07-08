import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileSlider } from './slider';

describe('MobileSlider', () => {
  let component: MobileSlider;
  let fixture: ComponentFixture<MobileSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileSlider],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
