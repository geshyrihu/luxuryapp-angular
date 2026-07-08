import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TagInputBase } from "./tag-input.base";

@Component({ selector: "test-tag-input", standalone: true, template: "" })
class Host extends TagInputBase {}

describe("TagInputBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
