import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { CarouselBase } from "./carousel.base";

@Component({ selector: "test-carousel", template: "" })
class Host extends CarouselBase {}

describe("CarouselBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
