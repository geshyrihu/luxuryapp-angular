import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputText } from './input-text';

describe('WebInputText', () => {
  let component: WebInputText;
  let fixture: ComponentFixture<WebInputText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputText],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
