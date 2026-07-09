import { TestBed } from "@angular/core/testing";
import { LxInputIcon } from "./inputicon";
import { PlatformService } from "src/app/core/services/platform.service";
import { vi } from "vitest";

describe("LxInputIcon", () => {
  it("renders the platform-selected inputicon", () => {
    TestBed.configureTestingModule({
      imports: [LxInputIcon],
      providers: [
        { provide: PlatformService, useValue: { isMobile: vi.fn(() => false) } },
      ],
    });
    const fixture = TestBed.createComponent(LxInputIcon);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
