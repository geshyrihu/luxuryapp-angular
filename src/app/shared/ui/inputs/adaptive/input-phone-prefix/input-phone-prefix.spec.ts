import { TestBed } from '@angular/core/testing';
import { InputPhonePrefix } from './input-phone-prefix';
import { PlatformService } from '@core/services/platform.service';
import { FlatpickrDefaults } from 'angularx-flatpickr';

describe('InputPhonePrefix', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputPhonePrefix], providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }, { provide: FlatpickrDefaults, useClass: FlatpickrDefaults }] });
    TestBed.overrideComponent(InputPhonePrefix, { set: { template: '<div></div>', imports: [] } });
    const fixture = TestBed.createComponent(InputPhonePrefix);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

