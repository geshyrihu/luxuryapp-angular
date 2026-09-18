import { TestBed } from '@angular/core/testing';
import { InputDateTime } from './input-date-time';
import { PlatformService } from '@core/services/platform.service';
import { FlatpickrDefaults } from 'angularx-flatpickr';

describe('InputDateTime', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputDateTime], providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }, { provide: FlatpickrDefaults, useClass: FlatpickrDefaults }] });
    const fixture = TestBed.createComponent(InputDateTime);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

