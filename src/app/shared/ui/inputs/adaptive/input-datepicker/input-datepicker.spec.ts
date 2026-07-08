import { TestBed } from '@angular/core/testing';
import { InputDatepicker } from './input-datepicker';
import { vi } from 'vitest';

vi.mock('src/app/core/services/platform.service', () => ({
  PlatformService: class { isMobile = vi.fn(() => false) },
}));

describe('InputDatepicker', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputDatepicker] });
    const fixture = TestBed.createComponent(InputDatepicker);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
