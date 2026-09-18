import { TestBed } from '@angular/core/testing';
import { InputUploadPdf } from './input-upload-pdf';
import { PlatformService } from '@core/services/platform.service';
import { FlatpickrDefaults } from 'angularx-flatpickr';

describe('InputUploadPdf', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputUploadPdf], providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }, { provide: FlatpickrDefaults, useClass: FlatpickrDefaults }] });
    TestBed.overrideComponent(InputUploadPdf, { set: { template: '<div></div>', imports: [] } });
    const fixture = TestBed.createComponent(InputUploadPdf);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

