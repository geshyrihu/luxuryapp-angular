import { TestBed } from '@angular/core/testing';
import { InputSelectPrefix } from './input-select-prefix';
import { vi } from 'vitest';

vi.mock('src/app/core/services/platform.service', () => ({
  PlatformService: class { isMobile = vi.fn(() => false) },
}));

describe('InputSelectPrefix', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputSelectPrefix] });
    const fixture = TestBed.createComponent(InputSelectPrefix);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
