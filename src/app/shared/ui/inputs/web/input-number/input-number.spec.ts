import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputNumber } from './input-number';

describe('WebInputNumber', () => {
  let component: WebInputNumber;
  let fixture: ComponentFixture<WebInputNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputNumber],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputNumber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
