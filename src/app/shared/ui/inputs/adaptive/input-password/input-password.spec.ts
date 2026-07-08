import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputPassword } from './input-password';

describe('InputPassword', () => {
  let component: InputPassword;
  let fixture: ComponentFixture<InputPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPassword],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
