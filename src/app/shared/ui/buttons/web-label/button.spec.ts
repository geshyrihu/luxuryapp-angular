import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonLabel } from './button';

describe('WebButtonLabel', () => {
  let component: WebButtonLabel;
  let fixture: ComponentFixture<WebButtonLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonLabel],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
