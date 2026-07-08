import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebInputUploadPdf } from './input-upload-pdf';
import { vi } from 'vitest';

vi.mock('../custom-input-upload-pdf-signal', () => ({
  SubirPdf: class {},
}));

describe('WebInputUploadPdf', () => {
  let component: WebInputUploadPdf;
  let fixture: ComponentFixture<WebInputUploadPdf>;

  beforeEach(() => {
    TestBed.overrideComponent(WebInputUploadPdf, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [WebInputUploadPdf],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WebInputUploadPdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
