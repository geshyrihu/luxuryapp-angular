import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputSearch } from './input-search';

describe('InputSearch', () => {
  let component: InputSearch;
  let fixture: ComponentFixture<InputSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSearch],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
