import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { StyleClassBase } from "./style-class.base";

@Component({ selector: "test-style-class", standalone: true, template: "" })
class Host extends StyleClassBase {}

describe("StyleClassBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
