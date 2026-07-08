import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomInputSelectButton } from './custom-input-select-button-signal';

describe('CustomInputSelectButton', () => {
  let component: CustomInputSelectButton;
  let fixture: ComponentFixture<CustomInputSelectButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInputSelectButton],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomInputSelectButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
