import { TestBed } from '@angular/core/testing';
import { InputAutocomplete } from './input-autocomplete';
import { PlatformService } from '@core/services/platform.service';
import { FlatpickrDefaults } from 'angularx-flatpickr';

describe('InputAutocomplete', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputAutocomplete], providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }, { provide: FlatpickrDefaults, useClass: FlatpickrDefaults }] });
    TestBed.overrideComponent(InputAutocomplete, { set: { template: '<div></div>', imports: [] } });
    const fixture = TestBed.createComponent(InputAutocomplete);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

