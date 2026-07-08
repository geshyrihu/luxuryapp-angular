import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputTextarea } from './input-textarea';

describe('InputTextarea', () => {
  let component: InputTextarea;
  let fixture: ComponentFixture<InputTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextarea],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTextarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
