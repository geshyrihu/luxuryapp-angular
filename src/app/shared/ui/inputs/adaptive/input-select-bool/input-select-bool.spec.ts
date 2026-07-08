import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputSelectBool } from './input-select-bool';

describe('InputSelectBool', () => {
  let component: InputSelectBool;
  let fixture: ComponentFixture<InputSelectBool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSelectBool],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSelectBool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
