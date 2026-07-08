import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputTime } from './input-time';

describe('WebInputTime', () => {
  let component: WebInputTime;
  let fixture: ComponentFixture<WebInputTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputTime],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputTime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
