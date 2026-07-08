import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AnimateOnScrollBase } from "./animate-on-scroll.base";

@Component({ selector: "test-animate-on-scroll", standalone: true, template: "" })
class Host extends AnimateOnScrollBase {}

describe("AnimateOnScrollBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
