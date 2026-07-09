import { TestBed } from "@angular/core/testing";
import { LxPopover } from "./popover";
import { PlatformService } from "src/app/core/services/platform.service";
import { vi } from "vitest";

describe("LxPopover", () => {
  it("renders the platform-selected popover", () => {
    TestBed.configureTestingModule({
      imports: [LxPopover],
      providers: [
        { provide: PlatformService, useValue: { isMobile: vi.fn(() => false) } },
      ],
    });
    const fixture = TestBed.createComponent(LxPopover);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
