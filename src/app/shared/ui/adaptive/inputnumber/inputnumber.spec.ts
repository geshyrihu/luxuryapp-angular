import { TestBed } from "@angular/core/testing";
import { LxInputnumber } from "./inputnumber";

describe("LxInputnumber (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxInputnumber] });
    expect(TestBed.createComponent(LxInputnumber).componentInstance).toBeTruthy();
  });
});
