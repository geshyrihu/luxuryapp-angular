import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PdfViewerModal } from './pdf-viewer-modal';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiResponseService } from '../../services/api-response.service';
import { vi } from 'vitest';

vi.mock('ng2-pdf-viewer', () => ({ PdfViewerModule: class {} }));
vi.mock('primeng/button', () => ({ Button: class {}, ButtonModule: class {}, ButtonDirective: class {}, ButtonIcon: class {}, ButtonLabel: class {}, ButtonStyle: class {} }));
vi.mock('primeng/progressspinner', () => ({ ProgressSpinnerModule: class {} }));

const dialogConfigMock = {
  data: {
    pdfSrc: 'http://example.com/test.pdf',
    fileName: 'test-document.pdf',
  },
};

const apiResponseServiceMock = {
  getBlobFileFromFullUrl: vi.fn().mockResolvedValue(new Blob(['test'])),
};

describe('PdfViewerModal', () => {
  let component: PdfViewerModal;
  let fixture: ComponentFixture<PdfViewerModal>;

  beforeEach(async () => {
    TestBed.overrideComponent(PdfViewerModal, {
      set: {
        template: '<div>Mock PDF Viewer</div>',
        imports: [],
      },
    });

    await TestBed.configureTestingModule({
      imports: [PdfViewerModal],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DynamicDialogConfig, useValue: dialogConfigMock },
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfViewerModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pdfSrc from dialog config', () => {
    expect(apiResponseServiceMock.getBlobFileFromFullUrl).toHaveBeenCalledWith(
      'http://example.com/test.pdf',
    );
  });

  it('should have fileName from dialog config', () => {
    expect(component.fileName).toBe('test-document.pdf');
  });

  it('should not fetch PDF when no pdfSrc in config', () => {
    apiResponseServiceMock.getBlobFileFromFullUrl.mockClear();
    TestBed.resetTestingModule();
    const emptyConfigMock = { data: {} };
    TestBed.overrideComponent(PdfViewerModal, {
      set: {
        template: '<div>Mock PDF Viewer</div>',
        imports: [],
      },
    });
    TestBed.configureTestingModule({
      imports: [PdfViewerModal],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DynamicDialogConfig, useValue: emptyConfigMock },
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
      ],
    });
    const emptyFixture = TestBed.createComponent(PdfViewerModal);
    emptyFixture.detectChanges();
    expect(apiResponseServiceMock.getBlobFileFromFullUrl).not.toHaveBeenCalled();
  });
});
