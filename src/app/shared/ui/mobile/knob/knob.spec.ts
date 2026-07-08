import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileKnob } from './knob';

describe('MobileKnob', () => {
  let component: MobileKnob;
  let fixture: ComponentFixture<MobileKnob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileKnob],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileKnob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
