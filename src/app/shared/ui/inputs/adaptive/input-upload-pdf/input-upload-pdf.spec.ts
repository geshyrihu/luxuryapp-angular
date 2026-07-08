import { TestBed } from '@angular/core/testing';
import { InputUploadPdf } from './input-upload-pdf';
import { vi } from 'vitest';

vi.mock('src/app/core/services/platform.service', () => ({
  PlatformService: class { isMobile = vi.fn(() => false) },
}));

describe('InputUploadPdf', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputUploadPdf] });
    const fixture = TestBed.createComponent(InputUploadPdf);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
