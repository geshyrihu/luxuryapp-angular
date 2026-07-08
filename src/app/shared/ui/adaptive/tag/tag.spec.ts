import { TestBed } from '@angular/core/testing';
import { LxTag } from './tag';
import { PlatformService } from 'src/app/core/services/platform.service';
import { vi } from 'vitest';

describe('LxTag', () => {
  it('renders the platform-selected tag', () => {
    TestBed.configureTestingModule({
      imports: [LxTag],
      providers: [
        { provide: PlatformService, useValue: { isMobile: vi.fn(() => false) } },
      ],
    });
    const fixture = TestBed.createComponent(LxTag);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
