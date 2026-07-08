import { TestBed } from "@angular/core/testing";
import { LxMeterGroup } from "./meter-group";

describe("LxMeterGroup (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxMeterGroup] });
    expect(TestBed.createComponent(LxMeterGroup).componentInstance).toBeTruthy();
  });
});
