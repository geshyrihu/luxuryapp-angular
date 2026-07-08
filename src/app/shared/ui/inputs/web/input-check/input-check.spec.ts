import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputCheck } from './input-check';

describe('WebInputCheck', () => {
  let component: WebInputCheck;
  let fixture: ComponentFixture<WebInputCheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputCheck],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputCheck);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
