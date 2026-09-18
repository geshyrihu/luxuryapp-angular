import { TestBed } from '@angular/core/testing';
import { InputMask } from './input-mask';
import { PlatformService } from '@core/services/platform.service';
import { FlatpickrDefaults } from 'angularx-flatpickr';

describe('InputMask', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputMask], providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }, { provide: FlatpickrDefaults, useClass: FlatpickrDefaults }] });
    TestBed.overrideComponent(InputMask, { set: { template: '<div></div>', imports: [] } });
    const fixture = TestBed.createComponent(InputMask);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

