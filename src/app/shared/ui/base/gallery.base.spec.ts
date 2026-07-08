import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { GalleryBase } from "./gallery.base";

@Component({ selector: "test-gallery", template: "" })
class Host extends GalleryBase {}

describe("GalleryBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
