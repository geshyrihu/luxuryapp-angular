import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubirPdf } from './custom-input-upload-pdf-signal';
import { DynamicDialogRef, DynamicDialogConfig } from 'src/app/core/services/dialog-handler.service';
import { ApiResponseService } from '@core/http/services/api-response.service';
import { vi } from 'vitest';

const mockDialogConfig = {
  data: {
    pathUrl: 'test/path/',
    serviceOrderId: '123',
  },
};

const mockApiResponse = {
  onPostFile: vi.fn().mockResolvedValue(true),
};

describe('SubirPdf', () => {
  let component: SubirPdf;
  let fixture: ComponentFixture<SubirPdf>;

  beforeEach(() => {
    TestBed.overrideComponent(SubirPdf, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [SubirPdf],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DynamicDialogRef, useValue: {} },
        { provide: DynamicDialogConfig, useValue: mockDialogConfig },
        { provide: ApiResponseService, useValue: mockApiResponse },
      ],
    });

    fixture = TestBed.createComponent(SubirPdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default maxFileSize as 20000000', () => {
    expect(component.maxFileSize).toBe(20000000);
  });

  it('should initialize url from dialog config', () => {
    expect(component.url).toBe('test/path/123');
  });

  it('should initialize pathUrl from dialog config', () => {
    expect(component.pathUrl).toBe('test/path/');
  });

  it('onFilesSelected stores files', () => {
    const files = [new File(['a'], 'a.pdf')];
    component.onFilesSelected({ files });
    expect(component.pendingFiles).toEqual(files);
  });
});
