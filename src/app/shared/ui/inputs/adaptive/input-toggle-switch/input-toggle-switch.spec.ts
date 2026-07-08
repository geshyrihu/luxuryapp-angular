import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputToggleSwitch } from './input-toggle-switch';

describe('InputToggleSwitch', () => {
  let component: InputToggleSwitch;
  let fixture: ComponentFixture<InputToggleSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputToggleSwitch],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputToggleSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
