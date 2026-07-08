import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebInputMultiselect } from './input-multiselect';

describe('WebInputMultiselect', () => {
  let component: WebInputMultiselect;
  let fixture: ComponentFixture<WebInputMultiselect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebInputMultiselect],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebInputMultiselect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
