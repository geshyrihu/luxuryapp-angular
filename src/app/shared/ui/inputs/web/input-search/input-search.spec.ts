import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputSearch } from './input-search';

describe('WebInputSearch', () => {
  let component: WebInputSearch;
  let fixture: ComponentFixture<WebInputSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputSearch],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
