import { TestBed } from '@angular/core/testing';
import { LxDataView } from './data-view';
import { PlatformService } from 'src/app/core/services/platform.service';
import { vi } from 'vitest';

describe('LxDataView', () => {
  it('renders the platform-selected data-view', () => {
    TestBed.configureTestingModule({
      imports: [LxDataView],
      providers: [
        { provide: PlatformService, useValue: { isMobile: vi.fn(() => false) } },
      ],
    });
    const fixture = TestBed.createComponent(LxDataView);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
