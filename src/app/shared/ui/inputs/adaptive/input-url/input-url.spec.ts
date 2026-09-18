import { TestBed } from '@angular/core/testing';
import { PlatformService } from '@core/services/platform.service';
import { InputUrl } from './input-url';

describe('InputUrl', () => {
  it('renders the platform-selected input', () => {
    TestBed.configureTestingModule({
      imports: [InputUrl],
      providers: [
        { provide: PlatformService, useValue: { isMobile: () => false } },
      ],
    });
    const fixture = TestBed.createComponent(InputUrl);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
