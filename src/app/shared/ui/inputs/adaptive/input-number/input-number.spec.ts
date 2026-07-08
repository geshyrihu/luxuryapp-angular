import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputNumber } from './input-number';

describe('InputNumber', () => {
  let component: InputNumber;
  let fixture: ComponentFixture<InputNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputNumber],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputNumber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
