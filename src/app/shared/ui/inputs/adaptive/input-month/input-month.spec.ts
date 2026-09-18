import { TestBed } from '@angular/core/testing';
import { InputMonth } from './input-month';
import { PlatformService } from '@core/services/platform.service';
import { FlatpickrDefaults } from 'angularx-flatpickr';

describe('InputMonth', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputMonth], providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }, { provide: FlatpickrDefaults, useClass: FlatpickrDefaults }] });
    const fixture = TestBed.createComponent(InputMonth);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

