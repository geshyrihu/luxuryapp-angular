import { TestBed } from "@angular/core/testing";
import { LxFileUpload } from "./file-upload";

describe("LxFileUpload (render)", () => {
  it("compiles web + mobile + adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxFileUpload] });
    const fixture = TestBed.createComponent(LxFileUpload);
    fixture.componentRef.setInput("multiple", true);
    fixture.componentRef.setInput("mobileSource", "both");
    expect(fixture.componentInstance).toBeTruthy();
  });
});
