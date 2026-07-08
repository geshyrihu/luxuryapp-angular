import { TestBed } from "@angular/core/testing";
import { LxImage } from "./image";

describe("LxImage (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxImage] });
    const fixture = TestBed.createComponent(LxImage);
    fixture.componentRef.setInput("src", "https://example.com/x.png");
    fixture.componentRef.setInput("alt", "demo");
    fixture.componentRef.setInput("preview", true);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
