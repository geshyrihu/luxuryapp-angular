import { TestBed } from '@angular/core/testing';
import { LxMessage } from './message';
import { PlatformService } from 'src/app/core/services/platform.service';
import { vi } from 'vitest';

describe('LxMessage', () => {
  it('renders the platform-selected message', () => {
    TestBed.configureTestingModule({
      imports: [LxMessage],
      providers: [
        { provide: PlatformService, useValue: { isMobile: vi.fn(() => false) } },
      ],
    });
    const fixture = TestBed.createComponent(LxMessage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
