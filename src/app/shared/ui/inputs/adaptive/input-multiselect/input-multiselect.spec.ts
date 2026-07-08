import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputMultiselect } from './input-multiselect';

describe('InputMultiselect', () => {
  let component: InputMultiselect;
  let fixture: ComponentFixture<InputMultiselect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputMultiselect],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputMultiselect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
