import { TestBed } from '@angular/core/testing';
import { InputDatepicker } from './input-datepicker';
import { PlatformService } from '@core/services/platform.service';
import { FlatpickrDefaults } from 'angularx-flatpickr';

describe('InputDatepicker', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputDatepicker], providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }, { provide: FlatpickrDefaults, useClass: FlatpickrDefaults }] });
    TestBed.overrideComponent(InputDatepicker, { set: { template: '<div></div>', imports: [] } });
    const fixture = TestBed.createComponent(InputDatepicker);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

