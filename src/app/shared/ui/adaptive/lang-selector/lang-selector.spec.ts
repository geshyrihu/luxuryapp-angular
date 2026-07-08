import { TestBed } from "@angular/core/testing";
import { LxLangSelector } from "./lang-selector";

describe("LxLangSelector (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxLangSelector] });
    expect(TestBed.createComponent(LxLangSelector).componentInstance).toBeTruthy();
  });
});
