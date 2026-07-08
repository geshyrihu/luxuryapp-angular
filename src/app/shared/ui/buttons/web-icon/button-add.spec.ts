import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonIconAdd } from './button-add';

describe('WebButtonIconAdd', () => {
  let component: WebButtonIconAdd;
  let fixture: ComponentFixture<WebButtonIconAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconAdd],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
