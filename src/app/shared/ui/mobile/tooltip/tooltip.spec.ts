import { TestBed } from "@angular/core/testing";
import { MobileTooltip } from "./tooltip";

describe("MobileTooltip (mobile)", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [MobileTooltip] });
    expect(TestBed.createComponent(MobileTooltip).componentInstance).toBeTruthy();
  });
});
