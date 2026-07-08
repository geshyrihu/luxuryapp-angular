import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ImageBase } from "./image.base";

@Component({ selector: "test-image", standalone: true, template: "" })
class TestImage extends ImageBase {}

describe("ImageBase", () => {
  function make() {
    TestBed.configureTestingModule({ imports: [TestImage] });
    return TestBed.createComponent(TestImage);
  }

  it("should instantiate", () => {
    expect(make().componentInstance).toBeTruthy();
  });

  it("widthStr returns string or undefined", () => {
    const f = make();
    expect(f.componentInstance.widthStr()).toBeUndefined();
    f.componentRef.setInput("width", 120);
    expect(f.componentInstance.widthStr()).toBe("120");
  });

  it("mobileStyle appends px to numeric sizes and merges imageStyle", () => {
    const f = make();
    f.componentRef.setInput("width", 120);
    f.componentRef.setInput("height", "50%");
    f.componentRef.setInput("imageStyle", { border: "1px solid red" });
    const s = f.componentInstance.mobileStyle();
    expect(s["width"]).toBe("120px");
    expect(s["height"]).toBe("50%");
    expect(s["border"]).toBe("1px solid red");
  });
});
