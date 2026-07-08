import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonIconViewPdf } from './button-view-pdf';

describe('WebButtonIconViewPdf', () => {
  let component: WebButtonIconViewPdf;
  let fixture: ComponentFixture<WebButtonIconViewPdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconViewPdf],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconViewPdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
