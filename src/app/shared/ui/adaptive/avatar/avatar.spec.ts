import { TestBed } from "@angular/core/testing";
import { LxAvatar } from "./avatar";

describe("LxAvatar (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxAvatar] });
    const fixture = TestBed.createComponent(LxAvatar);
    fixture.componentRef.setInput("label", "JD");
    fixture.componentRef.setInput("shape", "circle");
    expect(fixture.componentInstance).toBeTruthy();
  });
});
