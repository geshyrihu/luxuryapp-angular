import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LangSelectorBase } from "./lang-selector.base";

@Component({ selector: "test-lang-selector", standalone: true, template: "" })
class Host extends LangSelectorBase {}

describe("LangSelectorBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
