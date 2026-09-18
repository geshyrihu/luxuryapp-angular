import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DialogHandlerService } from '@core/services/dialog-handler.service';
import { WebButtonLabelViewPdf } from './button-view-pdf';

describe('WebButtonLabelViewPdf', () => {
  let component: WebButtonLabelViewPdf;
  let fixture: ComponentFixture<WebButtonLabelViewPdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonLabelViewPdf],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: DialogHandlerService, useValue: { openDialog: vi.fn() } }],
    });
    TestBed.overrideComponent(WebButtonLabelViewPdf, { set: { template: '<div></div>', imports: [] } });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(WebButtonLabelViewPdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
