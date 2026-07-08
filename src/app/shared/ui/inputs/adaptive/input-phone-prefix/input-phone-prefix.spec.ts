import { TestBed } from '@angular/core/testing';
import { InputPhonePrefix } from './input-phone-prefix';
import { vi } from 'vitest';

vi.mock('src/app/core/services/platform.service', () => ({
  PlatformService: class { isMobile = vi.fn(() => false) },
}));

describe('InputPhonePrefix', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputPhonePrefix] });
    const fixture = TestBed.createComponent(InputPhonePrefix);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
