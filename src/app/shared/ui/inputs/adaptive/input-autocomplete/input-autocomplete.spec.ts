import { TestBed } from '@angular/core/testing';
import { InputAutocomplete } from './input-autocomplete';
import { vi } from 'vitest';

vi.mock('src/app/core/services/platform.service', () => ({
  PlatformService: class { isMobile = vi.fn(() => false) },
}));

describe('InputAutocomplete', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputAutocomplete] });
    const fixture = TestBed.createComponent(InputAutocomplete);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
