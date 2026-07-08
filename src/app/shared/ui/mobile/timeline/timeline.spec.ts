import { TestBed } from "@angular/core/testing";
import { MobileTimeline } from "./timeline";

describe("MobileTimeline (mobile)", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [MobileTimeline] });
    expect(TestBed.createComponent(MobileTimeline).componentInstance).toBeTruthy();
  });
});
