import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputTextarea } from './input-textarea';

describe('WebInputTextarea', () => {
  let component: WebInputTextarea;
  let fixture: ComponentFixture<WebInputTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputTextarea],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputTextarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
