import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BlockUIBase } from "./block-ui.base";

@Component({ selector: "test-block-ui", template: "" })
class Host extends BlockUIBase {}

describe("BlockUIBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
