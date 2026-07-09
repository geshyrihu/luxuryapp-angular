import { TestBed } from "@angular/core/testing";
import { LxIconField } from "./iconfield";
import { PlatformService } from "src/app/core/services/platform.service";
import { vi } from "vitest";

describe("LxIconField", () => {
  it("renders the platform-selected iconfield", () => {
    TestBed.configureTestingModule({
      imports: [LxIconField],
      providers: [
        { provide: PlatformService, useValue: { isMobile: vi.fn(() => false) } },
      ],
    });
    const fixture = TestBed.createComponent(LxIconField);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
