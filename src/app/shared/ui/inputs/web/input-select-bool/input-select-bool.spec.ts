import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputSelectBool } from './input-select-bool';

describe('WebInputSelectBool', () => {
  let component: WebInputSelectBool;
  let fixture: ComponentFixture<WebInputSelectBool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputSelectBool],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputSelectBool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
