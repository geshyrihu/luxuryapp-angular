import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputCurrency } from './input-currency';

describe('WebInputCurrency', () => {
  let component: WebInputCurrency;
  let fixture: ComponentFixture<WebInputCurrency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputCurrency],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputCurrency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
