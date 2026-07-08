import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonIconSave } from './button-save';

describe('WebButtonIconSave', () => {
  let component: WebButtonIconSave;
  let fixture: ComponentFixture<WebButtonIconSave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconSave],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconSave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
