import { TestBed } from '@angular/core/testing';
import { LxLoader } from './loader';
import { PlatformService } from 'src/app/core/services/platform.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { vi } from 'vitest';

describe('LxLoader', () => {
  it('renders the platform-selected loader', () => {
    TestBed.configureTestingModule({
      imports: [LxLoader],
      providers: [
        { provide: PlatformService, useValue: { isMobile: vi.fn(() => false) } },
        { provide: LoaderService, useValue: { loading$: vi.fn(() => false) } },
      ],
    });
    const fixture = TestBed.createComponent(LxLoader);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
