import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputSelect } from './input-select';

describe('InputSelect', () => {
  let component: InputSelect;
  let fixture: ComponentFixture<InputSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSelect],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
