import { TestBed } from "@angular/core/testing";
import { MobileTabs } from "./tabs";

describe("MobileTabs (mobile)", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [MobileTabs] });
    expect(TestBed.createComponent(MobileTabs).componentInstance).toBeTruthy();
  });
});
