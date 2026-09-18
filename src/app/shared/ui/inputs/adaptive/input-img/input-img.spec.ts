import { TestBed } from '@angular/core/testing';
import { InputImg } from './input-img';
import { PlatformService } from '@core/services/platform.service';
import { FlatpickrDefaults } from 'angularx-flatpickr';

describe('InputImg', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputImg], providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }, { provide: FlatpickrDefaults, useClass: FlatpickrDefaults }] });
    const fixture = TestBed.createComponent(InputImg);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});

