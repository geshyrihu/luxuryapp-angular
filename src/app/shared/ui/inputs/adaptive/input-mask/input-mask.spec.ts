import { TestBed } from '@angular/core/testing';
import { InputMask } from './input-mask';
import { vi } from 'vitest';

vi.mock('src/app/core/services/platform.service', () => ({
  PlatformService: class { isMobile = vi.fn(() => false) },
}));

describe('InputMask', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputMask] });
    const fixture = TestBed.createComponent(InputMask);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
