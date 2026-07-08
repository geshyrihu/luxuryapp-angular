import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputCheck } from './input-check';

describe('InputCheck', () => {
  let component: InputCheck;
  let fixture: ComponentFixture<InputCheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCheck],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputCheck);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
