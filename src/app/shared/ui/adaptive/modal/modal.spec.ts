import { TestBed } from "@angular/core/testing";
import { PlatformService } from "@core/services/platform.service";
import { vi } from "vitest";
import { LuxModal } from "./modal";

describe("LuxModal", () => {
  it("renders the platform-selected modal", () => {
    TestBed.configureTestingModule({
      imports: [LuxModal],
      providers: [
        {
          provide: PlatformService,
          useValue: { isMobile: vi.fn(() => false) },
        },
      ],
    });
    const fixture = TestBed.createComponent(LuxModal);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
