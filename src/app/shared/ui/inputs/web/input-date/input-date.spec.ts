import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputDate } from './input-date';

describe('WebInputDate', () => {
  let component: WebInputDate;
  let fixture: ComponentFixture<WebInputDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputDate],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
