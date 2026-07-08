import { TestBed } from '@angular/core/testing';
import { InputMonth } from './input-month';
import { vi } from 'vitest';

vi.mock('src/app/core/services/platform.service', () => ({
  PlatformService: class { isMobile = vi.fn(() => false) },
}));

describe('InputMonth', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputMonth] });
    const fixture = TestBed.createComponent(InputMonth);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
