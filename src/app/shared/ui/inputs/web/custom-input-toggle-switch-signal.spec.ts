import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomInputToggleSwitch } from './custom-input-toggle-switch-signal';

describe('CustomInputToggleSwitch', () => {
  let component: CustomInputToggleSwitch;
  let fixture: ComponentFixture<CustomInputToggleSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInputToggleSwitch],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomInputToggleSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
