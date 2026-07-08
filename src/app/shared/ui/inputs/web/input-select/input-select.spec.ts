import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputSelect } from './input-select';

describe('WebInputSelect', () => {
  let component: WebInputSelect;
  let fixture: ComponentFixture<WebInputSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputSelect],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
