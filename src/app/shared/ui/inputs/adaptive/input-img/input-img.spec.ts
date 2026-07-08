import { TestBed } from '@angular/core/testing';
import { InputImg } from './input-img';
import { vi } from 'vitest';

vi.mock('src/app/core/services/platform.service', () => ({
  PlatformService: class { isMobile = vi.fn(() => false) },
}));

describe('InputImg', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({ imports: [InputImg] });
    const fixture = TestBed.createComponent(InputImg);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
