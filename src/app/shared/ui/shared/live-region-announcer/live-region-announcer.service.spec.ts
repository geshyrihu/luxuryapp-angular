import { TestBed } from "@angular/core/testing";
import { LiveRegionAnnouncer } from "./live-region-announcer.service";

describe("LiveRegionAnnouncer (service)", () => {
  it("is provided and instantiable", () => {
    expect(TestBed.inject(LiveRegionAnnouncer)).toBeTruthy();
  });
});
