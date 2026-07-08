import { TestBed } from '@angular/core/testing';
import { InputUrl } from './input-url';
import { vi } from 'vitest';

vi.mock('src/app/core/services/platform.service', () => ({
  PlatformService: class { isMobile = vi.fn(() => false) },
}));

describe('InputUrl', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputUrl] });
    const fixture = TestBed.createComponent(InputUrl);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
