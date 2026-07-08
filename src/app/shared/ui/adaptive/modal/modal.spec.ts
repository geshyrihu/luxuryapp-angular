import { TestBed } from '@angular/core/testing';
import { LxModal } from './modal';
import { PlatformService } from 'src/app/core/services/platform.service';
import { vi } from 'vitest';

describe('LxModal', () => {
  it('renders the platform-selected modal', () => {
    TestBed.configureTestingModule({
      imports: [LxModal],
      providers: [
        { provide: PlatformService, useValue: { isMobile: vi.fn(() => false) } },
      ],
    });
    const fixture = TestBed.createComponent(LxModal);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
