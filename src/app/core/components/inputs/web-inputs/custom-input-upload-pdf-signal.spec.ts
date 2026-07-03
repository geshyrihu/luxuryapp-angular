import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubirPdf } from './custom-input-upload-pdf-signal';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import { vi } from 'vitest';

const mockDialogConfig = {
  data: {
    pathUrl: 'test/path/',
    serviceOrderId: '123',
  },
};

const mockHttpClient = {
  post: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
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
        { provide: HttpClient, useValue: mockHttpClient },
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
    expect(component.url).toContain('/test/path/');
  });

  it('should initialize pathUrl from dialog config', () => {
    expect(component.pathUrl).toBe('test/path/');
  });

  describe('formatFileSize', () => {
    it('should return "0 Bytes" for 0 bytes', () => {
      expect(component.formatFileSize(0)).toBe('0 Bytes');
    });

    it('should format bytes as KB', () => {
      const result = component.formatFileSize(1024);
      expect(result).toContain('KB');
    });

    it('should format bytes as MB', () => {
      const result = component.formatFileSize(1048576);
      expect(result).toContain('MB');
    });
  });
});
