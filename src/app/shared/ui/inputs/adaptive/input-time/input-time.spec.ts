import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputTime } from './input-time';

describe('InputTime', () => {
  let component: InputTime;
  let fixture: ComponentFixture<InputTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTime],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
