import { TestBed } from '@angular/core/testing';
import { InputDateTime } from './input-date-time';
import { vi } from 'vitest';

vi.mock('src/app/core/services/platform.service', () => ({
  PlatformService: class { isMobile = vi.fn(() => false) },
}));

describe('InputDateTime', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputDateTime] });
    const fixture = TestBed.createComponent(InputDateTime);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
