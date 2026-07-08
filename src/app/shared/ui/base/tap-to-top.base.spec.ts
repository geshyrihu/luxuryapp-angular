import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TapToTopBase } from "./tap-to-top.base";

@Component({ selector: "test-tap-to-top", standalone: true, template: "" })
class Host extends TapToTopBase {}

describe("TapToTopBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
