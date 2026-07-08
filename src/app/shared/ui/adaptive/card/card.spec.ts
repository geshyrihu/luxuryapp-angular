import { TestBed } from '@angular/core/testing';
import { LxCard } from './card';
import { PlatformService } from 'src/app/core/services/platform.service';
import { vi } from 'vitest';

describe('LxCard', () => {
  it('renders the platform-selected card', () => {
    TestBed.configureTestingModule({
      imports: [LxCard],
      providers: [
        { provide: PlatformService, useValue: { isMobile: vi.fn(() => false) } },
      ],
    });
    const fixture = TestBed.createComponent(LxCard);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
