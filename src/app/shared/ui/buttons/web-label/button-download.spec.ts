import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonLabelDownload } from './button-download';

describe('WebButtonLabelDownload', () => {
  let component: WebButtonLabelDownload;
  let fixture: ComponentFixture<WebButtonLabelDownload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonLabelDownload],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonLabelDownload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
