import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomButtonViewPdf } from './custom-button-view-pdf';
import { DialogHandlerService } from '../../../services/dialog-handler.service';
import { vi } from 'vitest';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));

const dialogHandlerServiceMock = {
  openDialog: vi.fn(),
  sizeFull: 'full',
};

describe('CustomButtonViewPdf', () => {
  let component: CustomButtonViewPdf;
  let fixture: ComponentFixture<CustomButtonViewPdf>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonViewPdf],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DialogHandlerService, useValue: dialogHandlerServiceMock },
      ],
    });
    fixture = TestBed.createComponent(CustomButtonViewPdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have secondary severity by default', () => {
    expect(component.severity()).toBe('secondary');
  });

  it('should default finalIcon to mdi:file-pdf', () => {
    expect(component.finalIcon()).toBe('mdi:file-pdf');
  });

  it('should open PDF dialog on click', () => {
    fixture.componentRef.setInput('url', 'http://example.com/file.pdf');
    fixture.componentRef.setInput('fileName', 'test-file');
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(dialogHandlerServiceMock.openDialog).toHaveBeenCalled();
  });

  it('should call openDialog with correct parameters', () => {
    fixture.componentRef.setInput('url', 'http://example.com/file.pdf');
    fixture.componentRef.setInput('fileName', 'test-file');
    fixture.detectChanges();

    component.viewPdf();
    expect(dialogHandlerServiceMock.openDialog).toHaveBeenCalledWith(
      expect.any(Function),
      { pdfSrc: 'http://example.com/file.pdf', fileName: 'test-file' },
      'test-file',
      'full',
      true,
    );
  });

  it('should disable button when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
