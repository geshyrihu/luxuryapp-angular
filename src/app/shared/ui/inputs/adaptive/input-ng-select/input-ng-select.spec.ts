import { TestBed } from '@angular/core/testing';
import { InputNgSelect } from './input-ng-select';
import { vi } from 'vitest';

vi.mock('src/app/core/services/platform.service', () => ({
  PlatformService: class { isMobile = vi.fn(() => false) },
}));

describe('InputNgSelect', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputNgSelect] });
    const fixture = TestBed.createComponent(InputNgSelect);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
